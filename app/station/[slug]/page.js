import styles from './page.module.css';
import {apiUrl} from "@/helpers/api-url";
import EvStationDetails from "@/components/station";

async function getStationData(slug) {
    const response = await fetch(`${apiUrl()}/station/${slug}.json`);
    return response.json();
}

export default async function StationPage({params: {slug}}) {
    const stationData = await getStationData(slug);
    return (
        <EvStationDetails station={stationData}/>
    );
}