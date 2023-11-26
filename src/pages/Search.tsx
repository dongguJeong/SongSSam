import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useEffect,useState } from "react";
import Chart from "../components/Chart";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import BigTitle from "../components/BigTitle";
import LoadingCircle from "../components/LoadingCircle";
import { setLoadingfalse } from "../redux/loadingSlice";
import { IData } from "../asset/Interface";

const Wrapper = styled.div`
margin : 0 auto;
padding-bottom : 20px;  
padding : 0 40px;
`

const CircleWrapper = styled.div`
 position : fixed;
 
 width : 100vw;
 height : 100vh;
 top : 0;
 left : 0;
 background-color : transparent;
 display : flex;
 justify-content : center;
 align-items : center;
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



export default function Search(){

    const makeTitle = () => {
        return ` "${target}" 에 대한 검색 결과`
    }

    const dispatch = useDispatch();
    const {target} = useParams();

    const [search,setSearch] = useState<IData[]>([]);
    const [filterValue, setFilterValue] = useState("chartjson");

    const loading = useSelector((state : RootState) => state.loadingToken.loading);

    const handleFilterChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
      setFilterValue(e.target.value);
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await (await fetch(`https://songssam.site:8443/song/search?target=${target}&mode=0`,
              {
                method: "GET",
              }
            )).json();
            setSearch(response);
            dispatch(setLoadingfalse());
          }catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData(); 
      }, [target,loading]);
      
      
    return(
        <Layout>
            
            <Wrapper>
            <BigTitle title={makeTitle()}/>
            <FilterContainer>
              <Filter onChange={handleFilterChange}>
                      <option value="chartjson">전체</option>
                      <option value="uploaded_list">업로드 완료</option>
                      <option value="completed_list">전처리 완료</option>
              </Filter>
            </FilterContainer>  
              {
              loading ?
              <CircleWrapper>
                <LoadingCircle/>
              </CircleWrapper>
                :
              <Chart  
                smallTitle="목록"
                btnTitle ="커버곡 만들러 가기"  
                data={search} />
            }
            </Wrapper>
        </Layout>
    )

}