"use client";
import 'maplibre-gl/dist/maplibre-gl.css';
import {useRef, useState, useCallback, useEffect} from "react";
import Map, {MapProvider, Popup, NavigationControl, GeolocateControl} from 'react-map-gl/maplibre';
import LiveStationSource from "@/components/map/live-station-source";
import {apiUrl} from "@/helpers/api-url";
import {usePathname, useRouter} from "next/navigation";
import styles from './beacon-map.module.css';

export const API_KEY = 'NM2bzuwan7L5ET5h10no';

export default function BeaconMap({children}) {
    const router = useRouter();
    const pathname = usePathname();

    const [viewState, setViewState] = useState({
        longitude: -122.676483,
        latitude: 45.523064,
        zoom: 12
    });
    const [selectedStation, setSelectedStation] = useState(null);
    const [hasPerformedInitialLoad, setHasPerformedInitialLoad] = useState(false);
    const [boundsBeforeSelection, setBoundsBeforeSelection] = useState(null);

    const mapMovedCallbackRef = useRef();
    const mapRef = useRef();

    const updateMap = (evt) => {
        setViewState(evt.viewState);
        if (mapMovedCallbackRef.current) mapMovedCallbackRef.current();
    }

    function gotoStation({beaconName, coordinates}) {
        console.log('gotoStation', beaconName, coordinates);
        let preLoadedStation = {loading: true};
        if (coordinates) {
            mapRef.current.easeTo({
                center: coordinates,
                zoom: 17
            });
            preLoadedStation = {
                longitude: coordinates[0],
                latitude: coordinates[1],
                ...preLoadedStation
            };
        }

        setSelectedStation(preLoadedStation);

        // Fetch the station data
        fetch(`${apiUrl()}/station/${beaconName}.json`)
            .then(response => response.json())
            .then(data => {
                if (!data) return;
                if (!coordinates) {
                    mapRef.current.easeTo({
                        center: [data.longitude, data.latitude],
                        zoom: 17
                    });
                }
                setSelectedStation({
                    ...data,
                    loading: false
                });
            });
    }

    useEffect(() => {
        if (!hasPerformedInitialLoad && pathname.startsWith('/station/')) {
            const beaconName = pathname.split('/').pop();
            gotoStation({beaconName});
        }
        setHasPerformedInitialLoad(true);
    }, [pathname, hasPerformedInitialLoad, mapRef.current]);

    const onHover = useCallback(event => {
        const {features} = event;
        if (features && features.length) {
            if (mapRef.current) {
                mapRef.current.getCanvas().style.cursor = 'pointer';
            }
        } else {
            if (mapRef.current) {
                mapRef.current.getCanvas().style.cursor = '';
            }
        }
    }, []);

    const onClick = useCallback(event => {
        const {features} = event;
        if (!features || !features.length) return;

        // If a cluster is clicked, zoom in to the cluster
        if (features[0].properties.cluster) {
            const clusterId = features[0].properties.cluster_id;
            mapRef.current.getSource('stations').getClusterExpansionZoom(
                clusterId
            ).then((zoom, err) => {
                if (err) return;
                mapRef.current.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            });
            return;
        }

        // If a station is clicked, show the station popup
        const station = features[0];

        setBoundsBeforeSelection(mapRef.current.getBounds());
        router.push(`/station/${station.properties.beacon_name}`);

        gotoStation({
            beaconName: station.properties.beacon_name,
            coordinates: station.geometry.coordinates
        });
    }, [router, boundsBeforeSelection]);

    const onStationClose = useCallback(() => {
        setSelectedStation(null);
        if (boundsBeforeSelection) {
            mapRef.current.fitBounds(boundsBeforeSelection, {});
            setBoundsBeforeSelection(null);
        } else {
            mapRef.current.zoomTo(12);
        }
        router.back();
    }, [router, boundsBeforeSelection]);

    let stationPopupContents = null;
    if (selectedStation !== null && selectedStation.loading) {
        stationPopupContents = (<strong>Loading...</strong>);
    } else if (selectedStation !== null) {
        stationPopupContents = (
            <div>
                <strong>{selectedStation.station_name}</strong>
                <br/>
                <em>
                    {selectedStation.street_address}<br/>
                    {selectedStation.city}, {selectedStation.state} {selectedStation.zip}
                </em>
            </div>
        );
    }

    return (
        <MapProvider>
            <div className={styles.mapPanel}>
                {children}
            </div>
            <Map
                {...viewState}
                ref={mapRef}
                onMove={updateMap}
                onClick={onClick}
                onMouseMove={onHover}
                interactiveLayerIds={['stations-layer']}
                style={{
                    position: 'absolute',
                    top: '52px',
                    width: '100%',
                    height: 'calc(100vh - 52px)',
                    zIndex: '10',
                }}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`}>
                <LiveStationSource id="stations" updateSourceCallback={(cb) => mapMovedCallbackRef.current = cb}/>
                <NavigationControl position="top-right"/>
                <GeolocateControl position="top-right"/>
                {(selectedStation != null
                        && typeof selectedStation.longitude !== 'undefined'
                        && typeof selectedStation.latitude !== 'undefined') &&
                    <Popup anchor="top"
                           offset={[0, 15]}
                           longitude={selectedStation.longitude}
                           latitude={selectedStation.latitude}
                           onClose={onStationClose}>
                        {stationPopupContents}
                    </Popup>}
            </Map>
        </MapProvider>
    );
}
