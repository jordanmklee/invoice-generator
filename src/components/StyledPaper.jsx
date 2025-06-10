import { Paper, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	...theme.typography.body2,
	
}));

export default function CustomPaper({ children, ...rest }) {
	return (
		<StyledPaper variant="outlined" sx={{ borderRadius: "8px", border: "none" }} {...rest}>
			<Stack gap="16px">
				{children}
			</Stack>
		</StyledPaper>
	);
}
