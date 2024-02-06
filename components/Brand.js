import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';

export default function Brand() {
    return (
        <Navbar.Brand href="#home" className="d-flex align-items-center">
            <Image
                src="img/Logo_Text_Charge_Beacon_Light_Theme.svg"
                alt="ChargeBeacon"
                width={150}
                height={28}
            />
        </Navbar.Brand>
    );
}
