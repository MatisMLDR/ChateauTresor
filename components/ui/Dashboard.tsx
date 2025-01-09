import Image from "next/image";
import {DoubleLineChart} from "@/components/ui/DoubleLineChart";
import {HuntList} from "@/components/ui/HuntList";
import {Gauge, gaugeClasses} from '@mui/x-charts/Gauge'; //https://mui.com/x/react-charts/gauge/
import React from "react";

export function Dashboard () {



    const tempList = [
        { x_axis: "Janvier", firstLine: 186, secondLine: 80 },
        { x_axis: "Février", firstLine: 305, secondLine: 200 },
        { x_axis: "Mars", firstLine: 237, secondLine: 120 },
        { x_axis: "Avril", firstLine: 73, secondLine: 190 },
        { x_axis: "Mai", firstLine: 209, secondLine: 130 },
        { x_axis: "Juin", firstLine: 214, secondLine: 140 },
    ];

    const settings = {
        width: 200,
        height: 200,
        value: 60,
    };


    return (
        <div className='grid grid-cols-2 grid-rows-2 place-items-center border-l h-screen w-full bg-primary'>
            <DoubleLineChart className={"w-3/4"}
                             data={tempList}
                             title={"Statistiques"}
                             description={"De Janvier à Juin"}
                             firstLineLabel={"Participants"}
                             secondLineLabel={"Gains"}
            />

            <Gauge
                {...settings}
                cornerRadius="50%" startAngle={-90} endAngle={90} value={60}
                sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                        fill: '#00f',
                    },

                })}
            />

            <HuntList />
            <Image src={'/dashboard.svg'} alt={'dashboard'} width={64} height={64} />
        </div>
    );
}
