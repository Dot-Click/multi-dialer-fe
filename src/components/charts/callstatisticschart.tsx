import { PieChart, Pie, Label } from 'recharts';

// #region Sample data
const data = [
    { name: 'Group A', value: 400, fill: '#0088FE' },
    { name: 'Group B', value: 300, fill: '#00C49F' },
    { name: 'Group C', value: 300, fill: '#FFBB28' },
    { name: 'Group D', value: 200, fill: '#FF8042' },
];

// #endregion
const MyPie = () => (
    <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="60%" isAnimationActive={false} />
);


const CallStatisticChart = () => {
    return (
  

            <PieChart responsive className='h-full' style={{ aspectRatio: 1 }}>
                <MyPie />
                <Label position="center" fill="#666">
                    
                </Label>
            </PieChart>

      
    );
}

export default CallStatisticChart