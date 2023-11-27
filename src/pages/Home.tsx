import React, { useEffect,useState } from 'react';
import Layout from '../components/Layout';
import { styled } from 'styled-components';
import Chart from '../components/Chart';
import serverURL from "../asset/Url";
import BigTitle from '../components/BigTitle';
import { IData } from '../asset/Interface';
import AiChart from '../components/AIChart';

const Wrapper = styled.div`
  margin : 0 auto;
  padding-bottom : 20px;
  padding : 0 40px;
`

const FilterContainer = styled.div`
  width : 100%;
  display : flex;
  justify-content : flex-end;
  padding-right : 20px;
  padding-top : 50px;
  padding-bottom : 10px;

`

const Filter = styled.select`
  font-size : 12px;
  width : 85px;
  padding-top : 2px;
  padding-bottom : 2px;
  padding-left : 2px;
`


function Home() {

  const [chartData, setChartData] = useState<IData[]>([]);
  const [filterValue, setFilterValue] = useState("chartjson");
  
  useEffect(() => {
    if(filterValue === 'Ai'){
      return;
    }
    const fetchData = async () => {
      try {
        const response = await (await fetch(`https://${serverURL}/song/${filterValue}`,
          {
            method: "GET",         
          }
        )).json();        
        
        setChartData(response);

      }catch(err){
        console.log("실패!");
        console.log(err);
      }
    };
    fetchData();
    }, [filterValue]);

  const handleFilterChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(e.target.value);
  };

  
  return (
    <Layout>
      <Wrapper>
        <BigTitle title = '인기차트'/>
        <FilterContainer>
          <Filter onChange={handleFilterChange}>
                  <option value="chartjson">전체</option>
                  <option value="uploaded_list">업로드 완료</option>
                  <option value="completed_list">전처리 완료</option>
                  <option value='Ai'>Ai 커버곡</option>
          </Filter>
        </FilterContainer>
        {
          filterValue !== 'Ai'  ?
          <Chart  
          btnTitle ="커버곡 만들러 가기"  
          data={chartData}
          smallTitle='순위'
          />
          :
          null
        }
        
        {
          filterValue === 'Ai' ? 
          <>
            <AiChart ptrId={1} Ai_Name='10cm'></AiChart>
            <AiChart ptrId={3} Ai_Name='10cm'></AiChart>
          </>
          :
          null
        }
        
      </Wrapper>
    </Layout>
  )
};


export default Home;



