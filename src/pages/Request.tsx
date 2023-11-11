import Layout from "../components/Layout";
import React, { useRef,useState,useEffect } from "react";
import styled from "styled-components";
import BigTitle from "../components/BigTitle";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Wrapper = styled.div`
  margin : 0 auto;
  padding-bottom : 20px;
`

const UploadBox = styled.div<{dragging : string}>`
  background-color : white;
  padding-left : 45px;
 

`;


const UploadInput = styled.input<{dragging : string}>`
  
  width : 500px;
  min-height : 100px;
  border-radius : 10px;
  border : 4px dashed black;
  background-color : ${(props) => (props.dragging === 'true' ? 'gray' : 'white')};
  cursor : pointer;
  transition : background-color 0.1s ;

`;

const UploadForm = styled.form`
  display : flex;
  flex-direction : column;
`;

const UploadInputInfo = styled.div`
  width : 500px;
  
  span {
    font-size : 12px;
  }
`

const UploadInputInfo__title = styled.div`
  display : flex;
  margin-bottom : 20px;
  margin-top : 20px;
  border-bottom : 2px solid #D3D3D3;
  padding-bottom  :5px;
  padding-left : 10px;
  font-size  : 12px;
  font-weight : 500;
  color : gray;

  span{
    margin-right : 100px;
  }
`

const UploadBtn__container = styled.div`
  display : flex;
  overflow : hidden;
`

const UploadCancleBtn = styled.div`
  color  :  #FF0084;
  font-size : 12px;
  cursor : pointer;
  margin-right : 10px;

`
const UploadBtn = styled(UploadCancleBtn)`
  color : blue;
`;

const SelectedFileContainer = styled.div`
`

const SelectedFileDiv = styled.div`
  display : flex;
  margin-bottom : 10px;
  justify-content : space-between;
  
`

export default function Request (){

  const accessToken = useSelector((state: RootState) => state.accessToken.accessToken);
  const uploadInput = useRef<HTMLInputElement>(null);
  const [selectedFile , setSelectedFile] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

    const handleUpload = (songId: string, file : Blob) => {

        const fetchData = async () => {
          const formData = new FormData();
          const mp3File = new Blob([file] , {'type' : 'audio/mpeg'});
          formData.append('file',mp3File,file.name);
         
          try {
            const response = await fetch(`https://songssam.site:8443/song/upload?songId=${songId}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body : formData,
            });
            if (response.ok) {
              console.log("노래 업로드 성공");
            }
          } catch (error) {
            console.error("노래 업로드 실패 :", error);
          }
        };
      
        fetchData();
      };


      const handlePreprocess = (songId: string) => {

        const fetchData = async () => {
          try {
            const response = await fetch(`https://songssam.site:8443/song/preprocess?songId=${songId}`, {
              method: "POST",
            });
            if (response.ok) {
              console.log("노래 업로드 성공");
            }
          } catch (error) {
            console.error("노래 업로드 실패 :", error);
          }
        };
      
        fetchData();
      };


      const handleDragLeave = (e :React.DragEvent<HTMLDivElement> ) => {
        setDragging((prev) => prev = false);
      }

      const handleDragOver = (e :React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
       
      }

      const handleDragEnter = (e :React.DragEvent<HTMLDivElement> ) => {
        e.preventDefault();
        setDragging(true);
      }
    
      const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
      }

      const deleteSelectedFile = (index : number) => {
        setSelectedFile((prev) => prev.filter((_,i) => i !== index));

      }

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        const file = e.target.files?.[0];
        if(file){
          if (file.type === 'audio/mpeg') {
            setSelectedFile((prev) => [...prev, file]);
          }else {
            alert('mp3 파일만 업로드 할 수 있습니다');
          }
        }
        
      };

      useEffect(() => {
        console.log(selectedFile);
      },[selectedFile])

    return(
        <Layout>
            <Wrapper>
            <BigTitle title = '노래 요청하기'/>

            <UploadBox
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnter= {handleDragEnter}
              dragging= {dragging.toString()}
              
            >
              <UploadForm onSubmit={handleSubmit}>
                <UploadInput 
                  ref={uploadInput} 
                  type="file" 
                  dragging= {dragging.toString()}
                  onChange={handleFileChange}
                />
                
                <UploadInputInfo>
                  <UploadInputInfo__title>
                    <span>파일이름</span>
                  </UploadInputInfo__title>
                  {
                    selectedFile.map((mp3,index) => 
                    <SelectedFileContainer>
                      <SelectedFileDiv key={index}>
                        {mp3.name}
                        <UploadBtn__container>
                          <UploadCancleBtn onClick={() => deleteSelectedFile(index)}>
                            취소
                          </UploadCancleBtn>
                          <UploadBtn onClick={() => handleUpload(mp3.name, mp3)}>
                            업로드
                          </UploadBtn>
                          <UploadBtn onClick={() => handlePreprocess(mp3.name)}>
                            전처리
                          </UploadBtn>
                        </UploadBtn__container>
                      </SelectedFileDiv>
                    </SelectedFileContainer>  
                  )}
                  
                </UploadInputInfo>
              </UploadForm>  
            </UploadBox>
            </Wrapper>
        </Layout>
    )
}