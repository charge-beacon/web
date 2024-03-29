import {Layer, Source, useMap} from "react-map-gl/maplibre";
import {useEffect, useState} from "react";
import {apiUrl} from "@/helpers/api-url";

function stationURL(bounds) {
    const boundsStr = `${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}`;
    return `${apiUrl()}/geojson/stations?bounds=${boundsStr}`;
}

export default function LiveStationSource({updateSourceCallback, id}) {
    const layerID = `${id}-layer`;
    const layerStyle = {
        id: layerID,
        type: 'symbol',
        layout: {
            'icon-image': [
                'case',
                ['==', ['get', 'ev_dc_fast_num'], null],
                'gray-location',
                'blue-location'
            ],
            'icon-size': 0.3,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
        }
    };

    const {current: map} = useMap();
    const [bounds, setBounds] = useState(map.getBounds());
    const [stationSource, setStationSource] = useState(stationURL(bounds));

    updateSourceCallback(() => {
        setBounds(map.getBounds());
    });

    useEffect(() => {
        const stationTimeout = setTimeout(() => {
            setStationSource(stationURL(bounds));
        }, 10);

        return () => clearTimeout(stationTimeout);
    }, [bounds]);

    useEffect(() => {
        map.loadImage('/img/Blue_Location.png').then(({data}, error) => {
            if (error) throw error;
            if (!map.hasImage('blue-location')) map.addImage('blue-location', data);
        });
        map.loadImage('/img/Gray_Location.png').then(({data}, error) => {
            if (error) throw error;
            if (!map.hasImage('gray-location')) map.addImage('gray-location', data);
        });
    }, [map]);

    return (
        <Source id={id} type="geojson" data={stationSource}
                cluster={true}
                clusterRadius={20}
                clusterMaxZoom={14}>
            <Layer {...layerStyle}/>
        </Source>
    );
}
