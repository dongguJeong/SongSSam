import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useEffect,useState } from "react";
import serverURL from "../asset/Url";
import Chart, { IData } from "../components/Chart";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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

    

    const accessToken = useSelector((state: RootState) => state.accessToken);

    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await (await fetch(`https://${serverURL}/song/search?target=${target}&mode=0`,
              {
                method: "GET",
              }
            )).json();

            console.log(response);
            setSearch(response);

            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData(); 
      }, [target,accessToken]);



    return(
        <Layout>
            <Wrapper>
              <Chart title={makeTitle()} btnTitle ="커버곡 만들러 가기"  data={search} />
            </Wrapper>
        </Layout>
    )

}