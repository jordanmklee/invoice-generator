import { TableRow, TableCell } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Summary(props){
	return(
		<>
			<TableRow>
				<TableCell rowSpan={4} colSpan={2}/>
				<TableCell>
					<Typography variant="body1">Subtotal</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1">$ {parseFloat(props.data.subtotal).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>
					<Typography variant="body1">Tax</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="body1">$ {parseFloat(props.data.tax).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>
					<Typography variant="h6">Total</Typography>
				</TableCell>
				<TableCell align="right">
					<Typography variant="h6">$ {parseFloat(props.data.total).toFixed(2)}</Typography>
				</TableCell>
			</TableRow>
		</>
	)
}