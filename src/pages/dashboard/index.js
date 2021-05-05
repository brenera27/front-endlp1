import React, { useState, useEffect } from 'react'
import { Panel } from 'rsuite';
import { Doughnut } from 'react-chartjs-2';
export default function Produtos(props) {
  const [teste, setTeste] = useState()
  const labels = ['Alimentos', 'Bebidas', 'Outros'];
  const [grafico1, setGrafico1] = useState({
    labels,
    datasets: [
      {
        label: 'Teste',
        data: [5, 5, 3],
        backgroundColor: [
          '#376384',
          '#ff6384',
          '#ffc784',
        ],
      },
    ],
  });
  useEffect(() => {
    setTeste("Hello World")
  }, [])

  return (
    <div id="graficos">
      <div id="corpo-graficos">
        <Panel shaded bordered header={<h4>Gráficos</h4>}>
          <Doughnut
            height={400}
            width={400}
            data={grafico1}
            options={{ maintainAspectRatio: false }}
          />
        </Panel>
      </div>
    </div>
  );

}


