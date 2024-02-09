import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    CardSubtitle,
    Row,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Badge,
} from 'react-bootstrap';

const EvStationDetails = ({station}) => {
    return (
        <Card className="m-3 shadow-lg">
            <CardHeader>
                <CardTitle>
                    {station.station_name}
                </CardTitle>
                <CardSubtitle className="text-muted">
                    {station.street_address}<br/>
                    {station.city}, {station.state} {station.zip}
                </CardSubtitle>
            </CardHeader>

            <div>

                <ListGroup variant="flush">
                    <ListGroupItem>
                        <strong>Network:</strong> {station.ev_network}
                    </ListGroupItem>
                    <ListGroupItem>
                        <strong>Status:</strong>{' '}
                        <Badge bg={station.status_code === 'E' ? 'success' : 'warning'}>
                            {station.status_code == 'E' ? 'Operational' : 'Not Operational'}
                        </Badge>
                    </ListGroupItem>
                    <ListGroupItem>
                        <strong>Phone:</strong> {station.station_phone}
                    </ListGroupItem>
                </ListGroup>

                <div className="m-1 mx-3"><strong>Connectors:</strong></div>
                <ListGroup variant="flush">
                    {station.ev_connector_types.map((connector, index) => (
                        <ListGroupItem key={index}>
                            {connector}
                        </ListGroupItem>
                    ))}
                </ListGroup>

                <ListGroup variant="flush" className="mt-1">
                    <ListGroupItem>
                        <strong>Access Days/Time:</strong><br />
                        {station.access_days_time}
                    </ListGroupItem>
                    <ListGroupItem>
                        <strong>Access Code:</strong><br />
                        {station.access_code}
                    </ListGroupItem>
                    <ListGroupItem>
                        <strong>Cards Accepted:</strong><br />
                        {station.cards_accepted}
                    </ListGroupItem>
                </ListGroup>
            </div>
        </Card>
    );
};

export default EvStationDetails;
