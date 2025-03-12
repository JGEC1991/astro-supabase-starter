import { useState, useEffect } from 'react'
    import { supabase } from '../supabaseClient'
    import Table from '../components/Table'
    import Popout from '../components/Popout'

    const Expenses = () => {
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState(null)
      const [expenses, setExpenses] = useState([])
      const [showAddForm, setShowAddForm] = useState(false)
      const [newExpense, setNewExpense] = useState({
        date: '',
        amount: '',
        description: '',
        status: 'paid', // Default status
        activity_id: '',
        driver_id: '',
        vehicle_id: '',
      })
      const [activities, setActivities] = useState([])
      const [drivers, setDrivers] = useState([])
      const [vehicles, setVehicles] = useState([])

      const columns = [
        { key: 'date', title: 'Date' },
        { key: 'amount', title: 'Amount' },
        { key: 'description', title: 'Description' },
        { key: 'status', title: 'Status' },
        { key: 'activity_id', title: 'Activity ID' },
        { key: 'driver_id', title: 'Driver ID' },
        { key: 'vehicle_id', title: 'Vehicle ID' },
      ]

      useEffect(() => {
        const fetchExpenses = async () => {
          setLoading(true)
          setError(null)

          try {
            const { data, error } = await supabase
              .from('expenses')
              .select('*')

            if (error) {
              setError(error.message)
              return
            }

            setExpenses(data)
          } catch (err) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }

        const fetchActivities = async () => {
          try {
            const { data: activityData, error: activityError } = await supabase
              .from('activities')
              .select('id, description') // Fetch only necessary data

            if (activityError) {
              console.error('Error fetching activities:', activityError)
              return
            }

            setActivities(activityData)
          } catch (err) {
            console.error('Error fetching activities:', err)
          }
        }

        const fetchDrivers = async () => {
          try {
            const { data: driverData, error: driverError } = await supabase
              .from('drivers')
              .select('id, name') // Fetch only necessary data

            if (driverError) {
              console.error('Error fetching drivers:', driverError)
              return
            }

            setDrivers(driverData)
          } catch (err) {
            console.error('Error fetching drivers:', err)
          }
        }

        const fetchVehicles = async () => {
          try {
            const { data: vehicleData, error: vehicleError } = await supabase
              .from('vehicles')
              .select('id, make, model') // Fetch only necessary data

            if (vehicleError) {
              console.error('Error fetching vehicles:', vehicleError)
              return
            }

            setVehicles(vehicleData)
          } catch (err) {
            console.error('Error fetching vehicles:', err)
          }
        }

        fetchExpenses()
        fetchActivities()
        fetchDrivers()
        fetchVehicles()
      }, [])

      const handleAddExpenseClick = () => {
        setShowAddForm(true)
      }

      const handleCloseAddForm = () => {
        setShowAddForm(false)
      }

      const handleInputChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.id]: e.target.value })
      }

      const handleAddExpenseSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
          const { data, error } = await supabase
            .from('expenses')
            .insert([newExpense])
            .select()

          if (error) {
            setError(error.message)
            return
          }

          setExpenses([...expenses, ...data]) // Add the new expense to the list
          setNewExpense({ // Reset the form
            date: '',
            amount: '',
            description: '',
            status: 'paid',
            activity_id: '',
            driver_id: '',
            vehicle_id: '',
          })
          setShowAddForm(false) // Hide the form
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>
      }

      if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>
      }

      return (
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold">Expenses</h1>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
              onClick={handleAddExpenseClick}
            >
              Add Expense
            </button>
          </div>

          <Popout isOpen={showAddForm} onClose={handleCloseAddForm}>
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpenseSubmit} className="max-w-lg">
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input type="date" id="date" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.date} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                <input type="number" id="amount" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.amount} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea id="description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.description} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select id="status" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.status} onChange={handleInputChange}>
                  <option value="paid">Paid</option>
                  <option value="pastdue">Past Due</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="activity_id" className="block text-gray-700 text-sm font-bold mb-2">Activity</label>
                <select id="activity_id" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.activity_id} onChange={handleInputChange}>
                  <option value="">Select Activity</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>{activity.description}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="driver_id" className="block text-gray-700 text-sm font-bold mb-2">Driver</label>
                <select id="driver_id" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.driver_id} onChange={handleInputChange}>
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="vehicle_id" className="block text-gray-700 text-sm font-bold mb-2">Vehicle</label>
                <select id="vehicle_id" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={newExpense.vehicle_id} onChange={handleInputChange}>
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.make} - {vehicle.model}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add</button>
              </div>
            </form>
          </Popout>

          <Table data={expenses} columns={columns} />
        </div>
      )
    }

    export default Expenses
