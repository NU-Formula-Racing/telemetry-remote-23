import React, { Component } from 'react';
import Select, { components } from 'react-select';
import cloud_icon from '../../../assets/cloud.svg';
import local_icon from '../../../assets/local.svg'

const filterOptions = (option, input) => {
    if (input) {
        if (option.data.name.toLowerCase().includes(input.toLowerCase()) || 
        dateString(option.data.date).includes(input)){
          return true;
        } else {
          return false;
        }
    }
    return true;
    };

let fileList = [{name:"file1", date: new Date(2022,3,5), label: "cloud"}, {name: "file2", date:new Date(2021,10,12), label: "local"}, 
{name: "file3", date:new Date(2002,11,11), label: "cloud"},{name: "file4", date:new Date(2021,9,5), label: "local"}];

const dateString = (date) => {
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    month = (month + 1 < 10) ? "0" + (month + 1) : (month + 1)
    day = (day < 10) ? "0" + day : day
    return month + "/" + day + "/" + year;
}

const { Option } = components;
const IconOption = props => {
  let icon = (props.data.label == "cloud") ? cloud_icon : local_icon 
  return(
  <Option {...props}>
    {props.data.name} 
    <div style={{display: "inline", float: "right"}}>
    {dateString(props.data.date)}
    <img
      src={icon}
      style={{ width: 15, marginLeft: 20 }}
      alt={props.data.label}
    />
    </div>
  </Option>
);
}

export default class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {searchVal: null}
    this.myRef = React.createRef();
  }
  handleFocus= () => {
    this.setState({searchVal : null})
  };
  handleChange = value => {
    this.setState({searchVal : value})
    this.myRef.current.blur()
  };
  render() {
    return (
        <div style={{width: "100%", zIndex:"2"}}>
        <Select
        ref={this.myRef}
        placeholder={"Search for file by name or MM/DD/YYYY"}
        isClearable
        isSearchable
        name="search"
        options={fileList}
        filterOption={filterOptions}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        getOptionLabel={option =>
            `${option.name} (${dateString(option.date)})`
        }
        components={{ Option: IconOption }}
        value = {this.state.searchVal}
      />
      </div>
    );
  }
}
