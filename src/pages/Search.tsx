import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useEffect,useState } from "react";
import Chart, { IData } from "../components/Chart";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import BigTitle from "../components/BigTitle";

const Wrapper = styled.div`
margin : 0 auto;
padding-bottom : 20px;
  
`
export default function Search(){


    const makeTitle = () => {
        return ` "${target}" 에 대한 검색 결과`
    }

    const {target} = useParams();

    const [search,setSearch] = useState<IData[]>([]);

    

    const accessToken = useSelector((state: RootState) => state.accessToken);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await (await fetch(`https://songssam.site:8443/song/search?target=${target}&mode=0`,
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
            <BigTitle title={makeTitle()}/>
            <Wrapper>

              {
                search ? 
              <Chart  btnTitle ="커버곡 만들러 가기"  data={search} />
                :
              <h1>{target}에 대한 검색 결과가 없습니다</h1>
            }
            </Wrapper>
        </Layout>
    )

}