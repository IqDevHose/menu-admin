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
      return await res.data
    }
  })

  if (query.isPending) {
    <div>loading...</div>
  }
  else if (query.isError) {
    <div>error</div>
  }
  console.log(query.data)
  return (
    <div className=' flex items-start justify-center'>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>access Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            !query.isLoading && query?.data?.map((item: any) => {
              <TableRow>
                <TableCell className="font-medium">{item?.name}</TableCell>
                <TableCell>{item?.accessCode}</TableCell>
                <TableCell>{item?.description}</TableCell>
                <TableCell>{item?.updatedAt}</TableCell>
                <TableCell>{item?.createdAt}</TableCell>
              </TableRow>

            })
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default Restaurant