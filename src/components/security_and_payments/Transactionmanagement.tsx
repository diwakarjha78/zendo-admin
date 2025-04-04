import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

interface Transaction {
  id: number;
  transaction_id: string;
  order_id: string;
  price: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  User: {
    username: string;
    email: string;
  };
}

interface GetAllTransactionsResponse {
  status_code: number;
  message: string;
  data: Transaction[];
}

const ITEMS_PER_PAGE = 10;

const Transactionmanagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get<GetAllTransactionsResponse>('/getAllTransaction');
        if (response.data.status_code === 200) {
          setTransactions(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch transactions');
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          setError(String(axiosError.response.data) || 'Error fetching transactions');
        } else {
          setError(axiosError.message || 'Error fetching transactions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredTransactions = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return transactions.filter((txn) =>
      `${txn.transaction_id} ${txn.order_id} ${txn.User?.username} ${txn.User?.email}`
        .toLowerCase()
        .includes(lowerSearch)
    );
  }, [search, transactions]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className='p-4'>
      <div className="p-6 bg-white rounded shadow-md space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold capitalize">Transaction Management</h1>
        <Input
          placeholder="Search by user, order, transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-80"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">S.No</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((txn, idx) => (
                    <TableRow key={txn.id}>
                      <TableCell>{startIndex + idx + 1}</TableCell>
                      <TableCell>{txn.User?.username}</TableCell>
                      <TableCell>{txn.User?.email}</TableCell>
                      <TableCell>{txn.transaction_id}</TableCell>
                      <TableCell>{txn.order_id}</TableCell>
                      <TableCell>${txn.price}</TableCell>
                      <TableCell>{new Date(txn.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end pt-2 gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1} className="rounded">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm text-gray-700">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page === totalPages || totalPages === 0}
              className="rounded"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default Transactionmanagement;
