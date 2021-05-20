import React from 'react';
import {Divider, IconButton, InputBase} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	divider: {
		height: 28,
		margin: 4
	}
}));
const SearchBar = ({ onRemoveFilter, onSearch }) => {
	const classes = useStyles();
	const [input, setInput] = React.useState("");
	const handleClick = () => {
		onRemoveFilter(true);
		setInput("");
	}
	const handleInput = (event) => {
		setInput(event.target.value);
	}

	const handleSearch = () => {
		if(input.includes("-") && input.split("-").length === 5){
			onSearch(input, 'uuid')
		}
		else{
			onSearch(input.split(" "), 'keyword');
		}
	}

	return(
		<Paper component={"form"}>
			<div style={{display: "flex", flexDirection: 'row'}}>
				<InputBase placeholder={"uuid/keyword"} style={{fontSize: "13px", paddingLeft: '5px'}} value={input} onChange={handleInput} />
				<IconButton size="small" onClick={handleSearch}>
					<SearchIcon />
				</IconButton>
				<Divider className={classes.divider} orientation="vertical" />
				<Button style={{border: "1px solid white", textTransform: "none", paddingTop: '10px',
					lineHeight: "15px", maxWidth: '105px', maxHeight: '25px', fontSize: '11px' }} size={"small"} onClick={handleClick}>
					Remove filter
				</Button>
			</div>
		</Paper>
	)
}

export default SearchBar