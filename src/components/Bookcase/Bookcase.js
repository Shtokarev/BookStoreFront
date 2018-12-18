import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createSelector } from "reselect";

import BookCard from "../BookCard/BookCard";
import FilterPanel from "./FilterPanel/FilterPanel";
import { actionGetBooks } from "../../actions/actions";

const MainWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const CaseWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const getFilteredBookByCategory = createSelector(
  [
    state => state.books,
    state => state.filter.category
  ],
  (books, category) => {
    if(!books) {
      return null;
    }

    if(category) {
      return books.filter(item => item.category === category);

    } else {
      return [...books];
    }
  }
);

const getFilteredBookByRank = createSelector(
  [
    getFilteredBookByCategory,
    state => state.filter.rank
  ],
  (books, rank) => {
    if(!books) {
      return null;
    }

    if(rank !== "0") {
      return books.filter(item => item.rank === rank);

    } else {
      return [...books];
    }
  }
);

const getCoversToBook = createSelector(
  [getFilteredBookByRank],
  (books) => {

    if(!books) {
      return null;
    }
    return books.map((item)=>(item.Files.filter(itemFile => itemFile.type === "cover")[0].name));
  }
);



class Bookcase extends React.Component {
  
  componentDidMount() {
    this.props.getBooks();
  }

  bookClickHandler = id => {
    this.props.history.push("/books/" + id);
  }

  render() {
    return (
      <MainWrapper>
        <FilterPanel />


        <CaseWrapper>
          {this.props.books.map((item, index) => (
            <BookCard 
              id={item.id}
              key={item.id}
              title={item.title}
              author={item.author}
              price={item.price}
              rank={item.rank}

              //cover={item.Files.filter(item => item.type === "cover" )[0].name}
              cover={this.props.covers[index]}

              bookClick={this.bookClickHandler}
            />
          ))}

        </CaseWrapper>
      </MainWrapper>
    );    
  }
}

/* eslint-disable react/require-default-props */
Bookcase.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.number,
    description: PropTypes.string.isRequired,
    price: PropTypes.number,
    rank: PropTypes.string,
  })), 
  history: PropTypes.instanceOf(Object),
  getBooks: PropTypes.func.isRequired,
  covers: PropTypes.arrayOf(PropTypes.string)
};

function mapStateToProps(state) {
  return {
      //books: state.books,
      covers: getCoversToBook(state),
      books: getFilteredBookByRank(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
      getBooks: () => {
          dispatch(actionGetBooks());
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookcase);
