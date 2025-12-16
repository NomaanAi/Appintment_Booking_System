const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Approved: 'bg-green-100 text-green-800 border-green-200',
        Rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
