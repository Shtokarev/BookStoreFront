import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled, {css} from "styled-components";

import { actionSetPageCurrent, actionGetBooks } from "../../../actions/actions";


const borderColor = "#ddd";
const selectedColor = "#337ab7";
const pagesInPagigation = 5;

const DummyTool = styled.div`
  margin: 0 auto;
  height: 33px;
  width: 33px;
`;

const ToolWrap = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
`;

const ToolPagination = styled.ul`
  display: block;
  padding-left: 0;
  //margin: 0 auto;
  text-align: center;
  list-style-type: none;
  white-space : nowrap;
  
  @media only screen and (max-width : 768px)  {
    white-space : pre-wrap;
  }

`;

const selectedPage = css`
  background-color: ${selectedColor};
  border-color: ${selectedColor};
  color: white;
`;

const disabledPage = css`
  background-color: white;
  color: #777;
  cursor: default;
`;

const firstSpan = css`
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`;

const lastSpan = css`
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`;

const ToolPageButton = styled.li`
  display: inline-block;
  //margin-bottom: -3px;

  @media only screen and (max-width : 768px)  {
    margin-top: -4px;
  }

  span {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.4rem;
    color: ${selectedColor};
    background-color: #fff;
    border: 1px solid ${borderColor};
    cursor: pointer;
    user-select: none;
    ${props => (props.selected ? selectedPage: "")}
    ${props => (props.disabled ? disabledPage: "")}
    ${props => (props.first && firstSpan)}
    ${props => (props.last && lastSpan)}

    :hover {
      background-color: ${props => (props.disabled ? "": borderColor)};
    }
  }
`;


class Pagination extends React.Component {

  onClickPageHandler = (page) => {

    if(page === "prev") {
      page = this.props.page - 1;
    }

    if(page === "next") {
      page = this.props.page + 1;
    }

    if(page < 1 || page > this.props.pages) {
      return;
    }

    this.props.setCurrentPage(page);
  }

  getPagesMarkup = (startPage, endPage) => {
    let out = [];

    for(let i = startPage; i <= endPage; i++) {
      out.push(
        <ToolPageButton 
          key={i} 
          selected={this.props.page === i}
        >
          <span onClick={()=>this.onClickPageHandler(i)}>
            {i}
          </span>
        </ToolPageButton>
      );
    }

    return out;
  }

  render() {
    const {page, pages} = this.props;
    
    let startPage = 1;
    let endPage = pages;

    if(pages > pagesInPagigation) {
      const halfPage = Math.ceil(pagesInPagigation / 2);
      
      if(page <= halfPage) {
        endPage = startPage + pagesInPagigation - 1;

      } else if (page > pages - halfPage) {
        startPage = endPage - pagesInPagigation + 1;

      } else {
        startPage = page - halfPage + 1;
        endPage = startPage + pagesInPagigation - 1;
      }
    }
    
    return (
      <DummyTool>
        <ToolWrap>
          <ToolPagination>
            <ToolPageButton disabled={page === 1} first>
              <span onClick={()=>this.onClickPageHandler(1)}>
                Первая
              </span>
            </ToolPageButton>
            <ToolPageButton disabled={page === 1}>
              <span onClick={()=>this.onClickPageHandler("prev")}>
                Предыдущая
              </span>
            </ToolPageButton>
            
            {this.getPagesMarkup(startPage, endPage)}

            <ToolPageButton disabled={page >= pages}>
              <span onClick={()=>this.onClickPageHandler("next")}>
                Следующая
              </span>
            </ToolPageButton>
            <ToolPageButton disabled={page >= pages} last>
              <span onClick={()=>this.onClickPageHandler(pages)}>
                Последняя
                {/*pages*/}
              </span>
            </ToolPageButton>
          </ToolPagination>
        </ToolWrap>
      </DummyTool>  
    );
  }
}

/* eslint-disable react/require-default-props */
Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    page: state.pages.page,
    pages: state.pages.pages,
    size: state.pages.size
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentPage: (page) => {
      dispatch(actionSetPageCurrent(page));
      dispatch(actionGetBooks());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);


