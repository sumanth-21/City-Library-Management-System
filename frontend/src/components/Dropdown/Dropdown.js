import React, { useState } from "react";
import styled from "styled-components";
import NavigationItem from '../Navigation/NavigationItems/NavigationItem/NavigationItem';


const DropDownContainer = styled("div")`
    position: relative;
`;


const DropDownHeader = styled("div")`
    color: white;
    height: 100%;
    padding: 16px 10px;
    border-bottom: 4px solid transparent;
    cursor:pointer;
    min-width: 50px;
`;

const DropDownListContainer = styled("div")`
    position:absolute;
    top:55px;
    min-width: 150px;
    left: 50%;
    transform: translateX(-50%);
`;

const DropDownList = styled("ul")`
    padding: 0;
    margin: 0;
    background: #5c86f5;
    box-sizing: border-box;
    color: #3faffa;
`;


const Dropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggling = () => setIsOpen(!isOpen);

    return (
        <DropDownContainer>
            <DropDownHeader onClick={toggling}>
                {props.name}
            </DropDownHeader>
            {isOpen && (
                <DropDownListContainer>
                    <DropDownList>
                        {props.options.map((option, index) => (
                            <NavigationItem key={index} link={option.link} onClick={toggling}>{option.name}</NavigationItem>
                        ))}
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    );
}

export default Dropdown;