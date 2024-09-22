import { useEffect, useState } from 'react';

import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';


export default function InvoiceItem(props){
	return(
		<TableRow>
			<TableCell>
				<TextField
					placeholder="Description"
					value={props.data.description}
					onChange={e => props.setItemProperty("description", e.target.value)}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0.00"
					value={props.data.rate || ""}
					onChange={e => {
						props.setItemProperty("rate", e.target.value);
						props.setItemProperty("amount", (e.target.value * props.data.qty));
					}}
					InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0"
					type="number"
					value={props.data.qty}
					onChange={e => {
						props.setItemProperty("qty", e.target.value);
						props.setItemProperty("amount", (props.data.rate * e.target.value));
						}}/>
			</TableCell>
			<TableCell>
				<TextField
					disabled
					value={props.data.amount}
					InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}/>
			</TableCell>
			<TableCell>
				<Box><IconButton onClick={() => props.handleDelete(props.id)}>
					<DeleteIcon/>
				</IconButton></Box>
			</TableCell>
		</TableRow>
	)
}