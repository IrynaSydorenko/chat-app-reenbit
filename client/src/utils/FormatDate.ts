import { format } from 'date-fns';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Invalid date'; // or return a placeholder like 'N/A'
  }

  return format(date, 'dd/MM/yyyy hh:mm a');
};

export default formatDate;
