import { useState, useEffect } from "react";

import { Box, Button, Stack, Container, TextField, IconButton } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon }from '@mui/icons-material';
import Typography from '@mui/material/Typography';

import './App.css';

function InvoiceItem(props){
	return(
		<TableRow>
			<TableCell>
				<TextField label="Description"/>
			</TableCell>
			<TableCell>
				<TextField label="Rate"/>
			</TableCell>
			<TableCell>
				<TextField label="Qty"/>
			</TableCell>
			<TableCell>
				<TextField label="Amount"/>
			</TableCell>
			<TableCell>
				<Box><IconButton onClick={() => props.handleDelete(props.id)}>
					<DeleteIcon/>
				</IconButton></Box>
			</TableCell>
		</TableRow>
	)
}


export default function App() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		console.log(items);
	}, [items])

	function addNewItem(){
		setItems([...items, {id: "1"}]);
	}


	function deleteItem(index){
		let temp = [...items];
		temp.splice(index, 1);
		setItems(temp);
	}

	return (
		<Container>
			<Stack>
				<Typography variant="h4" gutterBottom>
					Invoice Generator
				</Typography>

				<Stack sx={{ alignItems: "flex-end" }}>
					<Box>
						<Button variant="contained">New Invoice</Button>
					</Box>
				</Stack>

				<TextField
					label="Company Name" />
				<Stack direction="row" sx={{ justifyContent: "space-between" }}>
					<TextField
						label="Bill To" />
					<Stack direction="row">
						<TextField
							label="Date" />
						<TextField
							label="Invoice No." />
					</Stack>
				</Stack>

				<Stack direction="row">
					<TextField label="Project Address" />
					<TextField label="P.O. No." />
					<TextField label="Terms" />
					<TextField label="Due Date" />
					<TextField label="Rep" />
				</Stack>

				<Typography variant="h5">Items</Typography>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Description</TableCell>
							<TableCell>Rate</TableCell>
							<TableCell>Qty</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell><Button
							variant="contained"
							onClick={addNewItem}>New Item</Button></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							items.map((item, index) => (
								<InvoiceItem key={index} id={index} handleDelete={deleteItem}/>
							))
						}

						{/* Summary */}
						<TableRow>
							<TableCell/>
							<TableCell/>
							<TableCell/>
							<TableCell>asd</TableCell>

						</TableRow>
					</TableBody>
				</Table>
			</Stack>
		</Container>

	)
}
