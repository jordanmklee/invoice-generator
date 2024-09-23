import { useState, useEffect } from "react";

import { Box, Button, Stack, Container, TextField } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';

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
			<Stack gap="64px" sx={{ paddingTop: "64px", paddingBottom: "64px" }}>
				<Typography variant="h4" gutterBottom>
					Invoice Generator
				</Typography>

				<Stack gap="24px">
					<TextField
						label="Company Name" />
					
					<Stack direction="row" gap="24px" sx={{ justifyContent: "space-between" }}>
						<TextField
							label="Bill To" />
						<Stack direction="row" gap="24px">
							<TextField
								label="Date" />
							<TextField
								label="Invoice No." />
						</Stack>
					</Stack>

					<Stack direction="row" gap="24px" sx={{ justifyContent: "space-between" }}>
						<TextField label="Project Address" />
						<TextField label="P.O. No." />
						<TextField label="Terms" />
						<TextField label="Due Date" />
						<TextField label="Rep" />
					</Stack>
				</Stack>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Item</TableCell>
							<TableCell sx={{ width: "12.5%" }}>Rate</TableCell>
							<TableCell sx={{ width: "7.5%" }}>Qty</TableCell>
							<TableCell sx={{ width: "20%" }} align="right">Amount</TableCell>
							<TableCell sx={{ width: "15%" }} align="right">
								<Button
									size="small"
									variant="contained"
									startIcon={<AddIcon/>}
									onClick={addNewItem}>New Item</Button>
							</TableCell>
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

				<Button variant="contained" size="large">Generate</Button>
			</Stack>
		</Container>

	)
}
