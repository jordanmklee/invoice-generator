import { Box, TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { TableRow, TableCell } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';


export default function InvoiceItem(props){
	return(
		<TableRow>
			<TableCell>
				<TextField
					placeholder="Description"
					fullWidth
					value={props.data.description}
					onChange={e => props.setItemProperty("description", e.target.value)}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0.00"
					fullWidth
					value={props.data.rate || ""}
					onChange={e => {
						// Only allow number entry up to two decimal places
						if(e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)){
							props.setItemProperty("rate", e.target.value);
							props.setItemProperty("amount", (e.target.value * props.data.qty));
						}
					}}
					slotProps={{
						input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0"
					fullWidth
					value={props.data.qty}
					onChange={e => {
						// Only allow number entry
						if(e.target.value.match(/^(|\d)+$/)){
							props.setItemProperty("qty", e.target.value);
							props.setItemProperty("amount", (props.data.rate * e.target.value));
						}
					}}
					slotProps={{
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}}/>
			</TableCell>
			<TableCell align="right">
				<Typography variant="body1">$ {parseFloat(props.data.amount).toFixed(2)}</Typography>
			</TableCell>
			<TableCell align="right">
				<Box>
					<IconButton onClick={() => props.handleDelete(props.id)}>
						<CloseIcon/>
					</IconButton>
				</Box>
			</TableCell>
		</TableRow>
	)
}