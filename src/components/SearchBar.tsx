import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { ChangeEvent } from 'react';


const SearchBarForm = styled.form`
    width : 100%;
    position : relative;
    margin-bottom : 30px;
`

const SearchBar = styled.input` 
    width : 100%;
    height : 35px;
    padding : 6px 15px 5px 15px;
    outline : none;
    border-radius : 30px;
    border : none;
    outline : none;
    box-shadow : 0 2px 5px 1px rgba(64,60,67,.16);

    &:focus {
        box-shadow : 0 2px 5px 1px rgba(255,255,255,.3);
    }   
`


const Svg = styled.svg`
    width : 15px; 
    height : 15px;
    position : absolute;
    top : 7px;
    right : 10px;
    z-index : 1;
    cursor : pointer;
    
`

const LargeSearchBar = styled.input`
  width : 100%;
  height : 50px;
  border-radius : 30px;
  padding-left : 15px;
  margin-bottom : 30px;
  border : 2px solid var(--iconColor);


  &:focus{
    outline : none;
  }

  &::placeholder{
    font-size : 15px; 
    font-weight : 500;
  }

`;

interface ISearchBar {
    small : boolean;
    
}

export default function SearchBBar ( {small} : ISearchBar){

    const movePage = useNavigate();

    const handleChange = (e :ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const [search, setSearch] = useState("");

    


    const handleSubmit = (e :React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(search === "")
            return;
        movePage(`/search/${search}`);
        setSearch("");
    }

    return small ?
            <SearchBarForm onSubmit={handleSubmit}>
            <SearchBar placeholder="아티스트/노래 검색" value={search} onChange={handleChange}>
            </SearchBar>
            
            <Svg  fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </Svg>
            </SearchBarForm> 
        :
            
            <form onSubmit={handleSubmit}>
                <LargeSearchBar placeholder="아티스트/노래 검색" value={search} onChange={handleChange}></LargeSearchBar>
            </form>

        
    
}
