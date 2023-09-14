import React, { useEffect,useState } from 'react';
import Layout from '../components/Layout';
import { styled } from 'styled-components';
import Chart from '../components/Chart';
import SearchBBar from '../components/SearchBar';
import serverURL from "../asset/Url";

import { IData } from '../components/Chart';

const Wrapper = styled.div`
  width : 80%;
  margin-left : 10%;
  padding-top : 80px;
  padding-bottom : 20px;
  
`


const chartCrawlingURL = `http://${serverURL}/v3/chartjson`;

function Search() {

  
  const [chartData, setChartData] = useState<IData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await (await fetch(chartCrawlingURL,
          {
            method: "GET",
          }
        )).json();
        
        console.log(response);
        setChartData(response);

      }catch(err){
        console.log("실패!");
        console.log(err);
      }
    };
    fetchData();

    }, []);

    
  

  return (
    <Layout>

   <Wrapper>

    

        <SearchBBar small={false} />

        <Chart title="인기 차트" btnTitle ="커버곡 만들러 가기"  data={chartData} />
      </Wrapper>
      </Layout>
  )
};


export default Search;



