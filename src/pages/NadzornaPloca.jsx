import { useState, useEffect } from "react"
import UredjajService from "../services/uredjaji/UredjajService"
import EventService from "../services/eventi/EventService"
import StatusService from "../services/statusi/StatusService"
import useLoading from "../hooks/useLoading"
import { Col, Container, Row } from "react-bootstrap"
import Highcharts from 'highcharts'
import HighchartsReactOfficial from 'highcharts-react-official'

const HighchartsReact = HighchartsReactOfficial.default

export default function NadzornaPloca() {

    const [podaciStatusi, setPodaciStatusi] = useState([])
    const [podaciEventi, setPodaciEventi] = useState([])
    const { showLoading, hideLoading } = useLoading()
    
    async function ucitajPodatkeStatusi() {
        const odgovorUredjaji = await UredjajService.get()

        if (!odgovorUredjaji.success) {
            alert('Greška kod dohvaćanja uređaja')
            return
        }

        const odgovorStatusi = await StatusService.get()

        if (!odgovorStatusi.success) {
            alert('Greška kod dohvaćanja statusa')
            return
        }

        const uredjaji = odgovorUredjaji.data
        const statusi = odgovorStatusi.data

        const statusMap = {}

        uredjaji.forEach((uredjaj) => {

            const statusObjekt = statusi.find(
                s => s.sifra === uredjaj.status
            )

            const nazivStatusa = statusObjekt?.naziv || 'Nepoznato'

            if (!statusMap[nazivStatusa]) {
                statusMap[nazivStatusa] = 0
            }

            statusMap[nazivStatusa]++
        })

        const chartPodaci = Object.keys(statusMap).map((status) => ({
            name: status,
            y: statusMap[status]
        }))

        console.log(chartPodaci)

        setPodaciStatusi(chartPodaci)
    }

    const fixedOptions = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Broj uređaja po statusima',
            align: 'left',
        },
        tooltip: {
            pointFormat: '{series.name}: </br> <b>{point.y}</b>',
        },
        accessibility: {
            enabled: false,
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                },
            },
        },
    };

    async function ucitajPodatkeEventi() {
        const odgovor = await EventService.get()

        if (!odgovor.success) {
            alert('Greška kod dohvaćanja evenata')
            return
        }

        const eventi = odgovor.data

        const mjeseci = [
            'Sij',
            'Velj',
            'Ožu',
            'Tra',
            'Svi',
            'Lip',
            'Srp',
            'Kol',
            'Ruj',
            'Lis',
            'Stu',
            'Pro'
        ]

        const brojPoMjesecima = Array(12).fill(0)

        eventi.forEach((event) => {

            const datum = new Date(event.datumPocetka)

            const mjesec = datum.getMonth()

            brojPoMjesecima[mjesec]++
        })

        const chartPodaci = mjeseci.map((mjesec, index) => ({
            name: mjesec,
            y: brojPoMjesecima[index]
        }))

        setPodaciEventi(chartPodaci)
    }

    useEffect(() => {
        ucitajPodatkeStatusi()
        ucitajPodatkeEventi()
    }, [])


    return (
        <>
            <Row>
                <Col md={6}>
                    <Container className='mt-4'>
                        {podaciStatusi.length > 0 && (
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                    ...fixedOptions,
                                    series: [
                                        {
                                            name: 'Statusi',
                                            colorByPoint: true,
                                            data: podaciStatusi,
                                        },
                                    ],
                                }}
                            />
                        )}
                    </Container>
                </Col>
                <Col md={6}>
                    <Container className='mt-4'>
                        {podaciEventi.length > 0 && (
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={{
                                    chart: {
                                        type: 'column'
                                    },

                                    title: {
                                        text: 'Broj evenata po mjesecima'
                                    },

                                    xAxis: {
                                        categories: podaciEventi.map(p => p.name),
                                        title: {
                                            text: 'Mjeseci'
                                        }
                                    },

                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Broj evenata'
                                        },
                                        allowDecimals: false
                                    },

                                    tooltip: {
                                        pointFormat: 'Broj evenata: <b>{point.y}</b>'
                                    },

                                    series: [
                                        {
                                            name: 'Eventi',
                                            data: podaciEventi.map(p => p.y)
                                        }
                                    ],

                                    accessibility: {
                                        enabled: false
                                    }
                                }}
                            />
                        )}
                    </Container>
                </Col>
            </Row>
        </>
    )
}
