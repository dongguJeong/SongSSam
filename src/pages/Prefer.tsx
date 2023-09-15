import React, { useEffect,useState } from "react";
import { styled} from 'styled-components';
import Layout from "../components/Layout";
import serverURL from "../asset/Url";
import { IData } from "../components/Chart";



const chartCrawlingURL = `http://${serverURL}/song/chartjson`;


const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding-top : 50px;
    flex-direction : column;
    
`

const Header = styled.div`
    
    text-align : center;
    width : 200px;
    height : 70px;
    font-size  : 17px;

    
    
`;

const HeaderBtn = styled.div<{bgcolor : string}>`
    background-color : ${ prop => prop.bgcolor};
    border-radius : 7px;
    text-align : center;
    padding : 5px 10px;
    margin-top : 10px;
`


const Grid = styled.div`
    display : grid;
    grid-template-columns : repeat(var(--gridNum), 130px);
    grid-gap : 45px;
`

const ChartContainer = styled.div<{bgpath : string ; isclicked : string | undefined}>`

    border-radius : 10px;
    height : 130px;
    background-image : url(${prop => prop.bgpath});
    background-size : cover;
    background-position: center;
    position : relative;

    display : flex;
    align-items : center;
    justify-content : center;

    background-color: ${props => (props.isclicked ? "rgba(0,0,0,0.5)" : 'transparent')};
    background-blend-mode: multiply;

    
    
`

const SongTitle = styled.div`
    position : absolute;
    bottom : -50px;
    left : 0px;
    width : 100%;
    height : 3rem;
    padding-top : 5px;
    padding-left : 5px;
    text-align : center;
`;


interface IClick {
    genre : string;
    title : string;
    artist : string;
}


function Prefer(){

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

    const [count ,setCount] = useState(0);
    const [clicked, setClicked] = useState<IClick[]>([]);

        const clickPrefer = ( {title ,genre ,artist} : IClick) => {

            const index = clicked.findIndex((i) => i.title === title);
            
            if( index === -1) //추가
            {
                if(count === 10){
                    return ;
                }

                const temp  = {title,genre,artist};
                setClicked((prev) => [...prev , temp]);
                setCount((cur) => cur+1);
            }

            else{ // 삭제
                setClicked([ ...clicked.slice(0,index), ...clicked.slice(index+1) ] );
                setCount((cur) => cur-1);
            }  
            
        }

        const handleSubmit = () => {
            
            alert("제출했습니다");
        }

        useEffect(() => {
            console.log(clicked);
          }, [clicked]);

    return(
        <Layout>
            <Wrapper>
                <Header>

                    <span> 선택한 곡  개수 {count} / 10 </span>
                    
                    <HeaderBtn bgcolor = {count === 10 ? "rgba(255, 165, 0,1)" : "rgba(255, 165, 0, 0.5)" }
                                style = {{cursor : count === 10 ?  "pointer" :  "not-allowed"}}
                                onClick={count === 10 ? handleSubmit : undefined}
                    >
                                
                        제출
                    </HeaderBtn> 

                    { count === 10 &&  <span>10개 모두 선택했습니다</span>}
                </Header>
                <Grid>
                {chartData?.map((song,i) => (
                    <ChartContainer  isclicked={clicked.some((item) => item.title === song.title) ? "true" : undefined} key={i} bgpath={song.imgUrl} onClick={() =>clickPrefer({title : song.title, genre : song.genre, artist : song.artist} )}>
                       
                       <SongTitle>{song.title.length <= 20 ? song.title : song.title.slice(0,20) + '...' }</SongTitle>
                       
                       {clicked.some((item) => item.title === song.title) &&
                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="green" height="2.5em" viewBox="0 0 512 512" >
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                        
                        }


                    </ChartContainer>
                ))}

                </Grid>
            </Wrapper>
        </Layout>
    )

}

export default Prefer;