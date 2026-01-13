import React, { useEffect } from 'react'
import { getDashboardSummary } from '../features/dashboard/dashboardThunk'
import { useDispatch, useSelector } from 'react-redux';

const AdminDashboard = () => {
    const {range} = useSelector(state => state.dashboard);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDashboardSummary({range : "WEEK"}))
    },[dispatch , range]);

    return (
        <div>AdminDashboard</div>
    )
}

export default AdminDashboard