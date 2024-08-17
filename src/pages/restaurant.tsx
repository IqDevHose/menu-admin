"use client"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Restaurant = () => {
  const query = useQuery({
    queryKey: ['restaurant'], queryFn: async () => {
      const res = await axios.get("http://localhost:3000/restaurant")
      return res.data
    }
  })

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  if (query.isError) {
    return <div>Error</div>
  }

  console.log(query.data)

  return (
    <div className='flex items-start justify-center'>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Access Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            query.data?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item?.name}</TableCell>
                <TableCell>{item?.accessCode}</TableCell>
                <TableCell>{item?.description}</TableCell>
                <TableCell>{item?.updatedAt}</TableCell>
                <TableCell>{item?.createdAt}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default Restaurant
