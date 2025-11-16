import { TransactionCategory } from "@/shared/interfaces/https/transaction-category-response";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { CreateTransactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Transaction } from "@/shared/interfaces/transaction";
import { TotalTransactions } from "@/shared/interfaces/total-transactions";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import {
  Filters,
  Pagination,
} from "@/shared/interfaces/https/get-transaction-request";
import { useAuthContext } from "./auth.context";

const filtersInitialValues = {
  categoryIds: {},
  typeId: undefined,
  from: undefined,
  to: undefined,
};

interface fetchTransactionsParams {
  page: number;
}

interface Loadings {
  initial: boolean;
  refresh: boolean;
  loadMore: boolean;
}

interface HandleLoadingsParams {
  key: keyof Loadings;
  value: boolean;
}

interface HandleFiltersParams {
  key: keyof Filters;
  value: Date | boolean | number;
}

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  fetchTransactions: (params: fetchTransactionsParams) => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  loadings: Loadings;
  handleLoadings: (params: HandleLoadingsParams) => void;
  pagination: Pagination;
  setSearchText: (text: string) => void;
  searchText: string;
  filters: Filters;
  handleFilters: (params: HandleFiltersParams) => void;
  handleCategoryFilters: (categoryId: number) => void;
  resetFilter: () => Promise<void>;
};

export const TransactionContext = createContext<TransactionContextType>({
  categories: [],
  transactions: [],
  totalTransactions: { expense: 0, revenue: 0, total: 0 },
  searchText: "",
  filters: filtersInitialValues,
  loadings: { initial: false, refresh: false, loadMore: false },
  pagination: { page: 1, perPage: 15, totalRows: 0, totalPages: 0 },

  // Funções vazias seguras
  fetchCategories: async () => {},
  createTransaction: async () => {},
  updateTransaction: async () => {},
  fetchTransactions: async () => {},
  refreshTransactions: async () => {},
  loadMoreTransactions: async () => {},
  handleLoadings: () => {},
  setSearchText: () => {},
  handleFilters: () => {},
  handleCategoryFilters: () => {},
  resetFilter: async () => {},
});

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<Filters>(filtersInitialValues);

  const [loadings, setLoadings] = useState<Loadings>({
    initial: false,
    refresh: false,
    loadMore: false,
  });
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    }
  );

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 15,
    totalRows: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setCategories([]);
      setTotalTransactions({ expense: 0, revenue: 0, total: 0 });
      setFilters(filtersInitialValues);
      setSearchText("");
      setPagination({ page: 1, perPage: 15, totalRows: 0, totalPages: 0 });
    }
  }, [user]);

  const categoryIds = useMemo(
    () =>
      Object.entries(filters.categoryIds)
        .filter(([key, value]) => value)
        .map(([key]) => Number(key)),
    [filters.categoryIds]
  );
  //Array de matriz, ex: [['1',true ],[],[]] 1º valor id, 2º valor boolean, se ativo ou n

  const handleLoadings = ({ key, value }: HandleLoadingsParams) =>
    setLoadings((prevValue) => ({ ...prevValue, [key]: value }));

  const refreshTransactions = useCallback(async () => {
    const { page, perPage } = pagination;

    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: page * perPage,
      ...filters,
      categoryIds,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, [pagination]); //, filters, categoryIds

  const fetchCategories = async () => {
    const categoriesResponse =
      await transactionService.getTransactionCategories();
    setCategories(categoriesResponse);
  };

  const createTransaction = async (transaction: CreateTransactionInterface) => {
    await transactionService.createTransaction(transaction);
    await refreshTransactions();
  };

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction);
    await refreshTransactions();
  };

  const fetchTransactions = useCallback(
    async ({ page = 1 }: fetchTransactionsParams) => {
      const transactionResponse = await transactionService.getTransactions({
        page,
        perPage: pagination.perPage,
        searchText,
        ...filters,
        categoryIds,
      });

      if (page === 1) {
        setTransactions(transactionResponse.data);
      } else {
        setTransactions((prevState) => [
          ...prevState,
          ...transactionResponse.data,
        ]);
      }

      setTotalTransactions(transactionResponse.totalTransactions);
      setPagination({
        ...pagination,
        page,
        totalRows: transactionResponse.totalRows,
        totalPages: transactionResponse.totalPages,
      });
    },
    [pagination, searchText, filters, categoryIds]
  );

  const loadMoreTransactions = useCallback(async () => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) return;
    fetchTransactions({ page: pagination.page + 1 });
  }, [loadings.loadMore, pagination]);

  const handleFilters = ({ key, value }: HandleFiltersParams) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryFilters = (categoryId: number) => {
    setFilters((prevValue) => ({
      ...prevValue,
      categoryIds: {
        ...prevValue.categoryIds,
        [categoryId]: !prevValue.categoryIds[categoryId],
      },
    }));
  };

  const resetFilter = useCallback(async () => {
    setFilters(filtersInitialValues);
    setSearchText("");

    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: pagination.perPage,
      searchText: "",
      categoryIds: [],
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page: 1,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, []);

  const value = useMemo(
    () => ({
      categories,
      fetchCategories,
      createTransaction,
      updateTransaction,
      fetchTransactions,
      totalTransactions,
      transactions,
      refreshTransactions,
      loadMoreTransactions,
      loadings,
      handleLoadings,
      pagination,
      setSearchText,
      searchText,
      filters,
      handleFilters,
      handleCategoryFilters,
      resetFilter,
    }),
    [
      categories,
      fetchCategories,
      createTransaction,
      updateTransaction,
      fetchTransactions,
      totalTransactions,
      transactions,
      refreshTransactions,
      loadMoreTransactions,
      loadings,
      handleLoadings,
      pagination,
      setSearchText,
      searchText,
      filters,
      handleFilters,
      handleCategoryFilters,
      resetFilter,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
