import { useState, useEffect } from "react";

import { Box, Button, Stack, Container, TextField } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import Summary from "./Form/Summary";
import InvoiceItem from "./Form/InvoiceItem";

import './App.css';


export default function App() {
	const [items, setItems] = useState([]);
	const [summary, setSummary] = useState({
		subtotal: 0.00,
		tax: 0.00,
		total: 0.00
	});


	// Update the summary on invoice item change
	useEffect(() => {
		let subtotal = 0.00;
		items.forEach(item => {
			subtotal += item.amount;
		})

		let tax = subtotal * 0.05;
		let total = subtotal + tax;

		setSummary({
			subtotal: subtotal,
			tax: tax,
			total: total,
		})
	}, [items])


	function addNewItem(){
		setItems([...items, { description: "", rate: 0.00, qty: 1, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...items];
		temp.splice(index, 1);
		setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...items];
		temp[index][property] = value;
		setItems(temp);
	}

	return (
		<Container>
			<Stack>
				<Typography variant="h4" gutterBottom>
					Invoice Generator
				</Typography>

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
								<InvoiceItem
									key={index}
									id={index}
									data={item}
									setItemProperty={(property, value) => setItemProperty(property, value, index)}
									handleDelete={deleteItem}/>
							))
						}

						<Summary data={summary}/>
					</TableBody>
				</Table>
			</Stack>
		</Container>

	)
}
