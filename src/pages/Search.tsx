import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useEffect,useState } from "react";
import serverURL from "../asset/Url";
import Chart, { IData } from "../components/Chart";
import styled from "styled-components";


const Wrapper = styled.div`
  width : 80%;
  margin-left : 10%;
  padding-top : 80px;
  padding-bottom : 20px;
  
`

export default function Search(){


    const makeTitle = () => {
        return ` "${target}" 에 대한 검색 결과`
    }

    const {target} = useParams();
    console.log(target);

    const [search,setSearch] = useState<IData[]>([]);

    const searchAPI = ( target : string | undefined, mode : number ) => {
        return `http://${serverURL}/v3/search?target=${target}&mode=${mode}`;
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(searchAPI(target, 0), {
              method: 'GET',
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
    
            const data = await response.json();
            console.log(data);
            setSearch(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData(); 
      }, [target]);

    return(
        <Layout>
            <Wrapper>
            <Chart title={makeTitle()} btnTitle="일단 진행 시켜" data={search}/>
            </Wrapper>
        </Layout>
    )

}