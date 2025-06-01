import { Button, Stack } from '@mui/material';
import { TextField, IconButton, InputAdornment,  } from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Card, CardContent } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';


// Wrapper for MUI Textfield with styles and label
function FormTextfield(props){
	return(
		<Stack sx={{ flex: 1 }}>
			<Typography variant="overline">{props.label}</Typography>
			<TextField
				size="small"
				placeholder={props.placeholder}
				value={props.value}
				onChange={e => props.onChange(e.target.value)} />
		</Stack>
	)
}


function InvoiceItem(props){
	// Add a new InvoiceItem if "enter" is pressed when typing in a TextField
	function handleEnterKeypress(e){
		if (e.key === 'Enter') {
			e.preventDefault();	// Prevent default action
			props.addNewItem();
		}
	}

	return(
		<TableRow>
			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					fullWidth
					size="small"
					value={props.data.description}
					onKeyDown={handleEnterKeypress}
					onChange={e => props.setItemProperty("description", e.target.value)}
					autoFocus={props.autoFocus}/>
			</TableCell>

			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					placeholder="0"
					type="number"
					fullWidth
					size="small"
					value={props.data.qty}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry
						if (e.target.value.match(/^(|\d)+$/)) {
							props.setItemProperty("qty", e.target.value);
							props.setItemProperty("amount", (props.data.rate * e.target.value));
						}
					}}
					slotProps={{
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell sx={{ borderBottom: "none" }}>
				<TextField
					placeholder="0.00"
					fullWidth
					size="small"
					value={props.data.rate || ""}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry up to two decimal places
						if (e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)) {
							props.setItemProperty("rate", e.target.value);
							props.setItemProperty("amount", (e.target.value * props.data.qty));
						}
					}}
					slotProps={{
						input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell sx={{ borderBottom: "none" }}>
				<IconButton size="small" onClick={() => props.handleDelete(props.id)}>
					<CloseIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	)
}


export default function Form(props){
	function addNewItem(){
		props.setItems([...props.items, { description: "", qty: 1, rate: 0.00, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...props.items];
		temp.splice(index, 1);
		props.setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...props.items];
		temp[index][property] = value;
		props.setItems(temp);
	}

	return(
		<Stack gap="32px" sx={{ ...props.sx, padding: "32px" }}>
			<Typography variant="h5">Invoice Details</Typography>

			<Card>
				<CardContent>
					<Stack padding="16px" gap="32px">
						<Stack gap="32px" direction="row">
							<FormTextfield
								label="Invoice Number"
								value={props.invoiceNumber}
								onChange={props.setInvoiceNumber}/>

							<Stack sx={{ flex: 1 }}>
								<Typography variant="overline">Date</Typography>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										slotProps={{ textField: { size: "small" } }}
										format="LL"
										value={props.date}
										onChange={e => props.setDate(e)} />
								</LocalizationProvider>
							</Stack>
						</Stack>

						<Stack gap="32px" direction="row">
							<FormTextfield
								label="Company Name"
								value={props.companyName}
								onChange={props.setCompanyName} />

							<Stack gap="16px" sx={{ flex: 1 }}>
								<FormTextfield
									label="Bill To"
									value={props.customerName}
									onChange={props.setCustomerName} />

								<FormTextfield
									label="Customer Address"
									value={props.projectAddress}
									onChange={props.setProjectAddress} />
							</Stack>
						</Stack>

						<Stack>
							<Typography variant="overline">Notes</Typography>
							<TextField
								size="small"
								multiline
								minRows={3}
								value={props.notes}
								onChange={e => props.setNotes(e.target.value)}/>
						</Stack>
					</Stack>
				</CardContent>
			</Card>

			<Typography variant="h5">Items</Typography>
			<Stack gap="16px" direction="row" alignItems="flex-start" justifyContent="space-between">
				{/* Items Form */}
				<Card sx={{ flex: 1 }}>
					<CardContent>
						<Stack padding="16px" gap="16px">

							<Table>
								<TableBody>
									<TableRow>
										<TableCell sx={{ width: "60%" }}>
											<Typography variant="overline">Description</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Quantity</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Rate</Typography>
										</TableCell>
										<TableCell/>
									</TableRow>
									{
										props.items.map((item, index) => (
											<InvoiceItem
												key={index}
												id={index}
												data={item}
												setItemProperty={(property, value) => setItemProperty(property, value, index)}
												handleDelete={deleteItem}
												// Autofocus newly added items
												autoFocus={ (index === props.items.length - 1) && index !== 0 }
												addNewItem={addNewItem}/>
										))
									}
								</TableBody>
							</Table>

							<Button
								variant="text"
								startIcon={<AddIcon/>}
								onClick={addNewItem}>New Item</Button>
						</Stack>
					</CardContent>
				</Card>
				
				{/* Summary */}
				<Card>
					<CardContent>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="body1">Subtotal</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="body1">$ {parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="body1">Tax</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="body1">$ {parseFloat(props.summary.tax).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell sx={{ borderBottom: "none" }}>
										<Typography variant="h6" style={{ fontWeight: 600 }}>Total</Typography>
									</TableCell>
									<TableCell align="right" sx={{ borderBottom: "none" }}>
										<Typography variant="h6" style={{ fontWeight: 600 }}>$ {parseFloat(props.summary.total).toFixed(2)}</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>

			</Stack>
		</Stack>
	)
}

