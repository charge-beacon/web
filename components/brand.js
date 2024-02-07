import Image from 'next/image';
import Link from "next/link";

export default function BeaconBrand() {
    return (
        <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image
                src="/img/Logo_Text_Charge_Beacon_Light_Theme.svg"
                alt="ChargeBeacon"
                width={150}
                height={28}
            />
        </Link>
    );
}
