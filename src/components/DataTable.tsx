import {
  Box,
  Button,
  ButtonGroup,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import type {
  DataGridProps,
  GridEditCellPropsParams,
  GridRowId,
  GridRowsProp,
} from '@material-ui/data-grid';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@material-ui/data-grid';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Publish from '@material-ui/icons/Publish';
import Refresh from '@material-ui/icons/Refresh';
import Alert from '@material-ui/lab/Alert';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { db } from '../db';
import { InsertValuesCtx } from '../utils/context';
import { hashPwd } from '../utils/password';
import type { DbQuery } from '../utils/types';
import { ChooseForm } from './ChooseForm';
import { CourseForm } from './CourseForm';
import { StudentForm } from './StudentForm';

type DataTableProps = Omit<DataGridProps, 'rows'> & {
  tableName: string;
  dataQuery: DbQuery;
  queryKeys: string[];
  allowInsert?: boolean;
  allowDelete?: boolean;
};

function getRowId(row: any): string {
  return ''.concat(
    row.adm_id ?? '',
    row.stu_id ?? '',
    row.cour_id ?? '',
    row.choose_year ?? '',
    row.tea_id ?? '',
    row.class ?? ''
  );
}

function useRefresh(): [number, () => void] {
  const [refreshCnt, setRefreshCnt] = useState<number>(0);
  return [
    refreshCnt,
    () => {
      setRefreshCnt((cnt) => cnt + 1);
    },
  ];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: 'calc(100vh - 48px)',
    },
    toolbar: {
      justifyContent: 'flex-end',
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 400,
    },
  })
);

export function DataTable({
  tableName,
  dataQuery,
  queryKeys,
  columns,
  allowInsert = false,
  allowDelete = false,
  ...dataGridProps
}: DataTableProps) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [errMsg, setErrMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshCnt, handleRefresh] = useRefresh();

  const transaction = useRef<DbQuery[]>([]);
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    db.query(dataQuery.queryText, dataQuery.values, (err, res) => {
      if (err) setErrMsg(err.message);
      if (res) setRows(res.rows.map((row) => ({ id: getRowId(row), ...row })));
      setLoading(false);
    });
  }, [dataQuery, refreshCnt]);

  const handleEditCellChangeCommitted = useCallback(
    ({ id, field, props }: GridEditCellPropsParams) => {
      rows.forEach((row) => {
        if (row.id === id) {
          transaction.current.push({
            queryText: `UPDATE ${tableName} SET ${field} = $1 WHERE ${queryKeys
              .map((key, index) => `${key} = $${index + 2}`)
              .join(' AND ')}`,
            values: [props.value, ...queryKeys.map((key) => row[key])],
          });
        }
      });
    },
    [queryKeys, rows, tableName]
  );

  const handleRemove = useCallback(() => {
    if (selectionModel.length === 0) return;
    selectionModel.forEach((id) => {
      rows.forEach((row) => {
        if (row.id === id) {
          transaction.current.push({
            queryText: `DELETE FROM ${tableName} WHERE ${queryKeys
              .map((key, index) => `${key} = $${index + 1}`)
              .join(' AND ')}`,
            values: queryKeys.map((key) => row[key]),
          });
        }
      });
    });

    setRows((oldRows) =>
      oldRows.filter(
        (row) =>
          selectionModel.findIndex((selected) => selected === row.id) === -1
      )
    );

    setSelectionModel([]);
    // handleRefresh();
  }, [queryKeys, rows, selectionModel, tableName]);

  const handleTransactionExecute = useCallback(async () => {
    try {
      setLoading(true);
      await db.query('BEGIN');
      await Promise.all(
        transaction.current.map((query) =>
          db.query(query.queryText, query.values)
        )
      );
      await db.query('COMMIT');
    } catch (err) {
      setErrMsg(String(err));
      await db.query('ROLLBACK');
      handleRefresh();
    } finally {
      transaction.current = [];
      setLoading(false);
    }
  }, [handleRefresh]);

  const InsertForm = useMemo(() => {
    switch (tableName) {
      case 'course': {
        return CourseForm;
      }
      case 'student': {
        return StudentForm;
      }
      case 'choose': {
        return ChooseForm;
      }
      default: {
        return undefined;
      }
    }
  }, [tableName]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [insertValues, setInsertValues] = useState<Record<string, unknown>>({});
  const handleInsert = useCallback(async () => {
    if (Object.keys(insertValues).length === 0) return;

    const row = { ...insertValues };
    const fields = Object.keys(row);
    if (row.pwd) {
      row.pwd = await hashPwd(row.pwd as string);
    }
    const values = fields.map((field) => row[field]);
    transaction.current.push({
      queryText: `INSERT INTO ${tableName} (${fields.join(
        ', '
      )}) VALUES (${fields.map((_val, index) => `$${index + 1}`)})`,
      values,
    });

    setRows((oldRows) => [
      ...oldRows,
      { id: getRowId(insertValues), ...insertValues },
    ]);

    setDialogOpen(false);
    setInsertValues({});
  }, [insertValues, tableName]);

  const allowEdit = useMemo(() => {
    return allowInsert || allowDelete || columns.some((col) => col.editable);
  }, [allowDelete, allowInsert, columns]);

  const toolbar = useCallback(() => {
    return (
      <GridToolbarContainer className={classes.toolbar}>
        <ButtonGroup style={{ flex: 1 }} color="primary" variant="outlined">
          <GridToolbarFilterButton />
          <GridToolbarColumnsButton />
        </ButtonGroup>
        <ButtonGroup color="primary" variant="outlined">
          {allowInsert && InsertForm && (
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <AddCircleOutline />
              Insert
            </Button>
          )}
          {allowDelete && (
            <Button
              onClick={handleRemove}
              disabled={selectionModel.length === 0}
            >
              <DeleteForever />
              Delete
            </Button>
          )}
          {allowEdit && (
            <Button
              onClick={handleTransactionExecute}
              disabled={transaction.current.length === 0 || loading}
            >
              <Publish />
              Submit
            </Button>
          )}
          <Button onClick={handleRefresh} disabled={loading}>
            <Refresh />
            Refresh
          </Button>
        </ButtonGroup>
      </GridToolbarContainer>
    );
  }, [
    InsertForm,
    allowDelete,
    allowEdit,
    allowInsert,
    classes.toolbar,
    handleRefresh,
    handleRemove,
    handleTransactionExecute,
    loading,
    selectionModel.length,
  ]);

  return (
    <Box className={classes.container}>
      <DataGrid
        {...dataGridProps}
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[10, 20, 50, 100]}
        rowHeight={32}
        checkboxSelection={allowDelete}
        disableColumnMenu
        disableSelectionOnClick
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection.selectionModel);
        }}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        loading={loading}
        components={{
          Toolbar: toolbar,
          LoadingOverlay: LinearProgress,
        }}
      />
      {allowInsert && InsertForm && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Insert into {tableName}</DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <InsertValuesCtx.Provider value={{ insertValues, setInsertValues }}>
              <InsertForm />
            </InsertValuesCtx.Provider>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" onClick={handleInsert}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar autoHideDuration={5000} open={!!errMsg}>
        <Alert
          variant="filled"
          severity="error"
          onClose={() => {
            setErrMsg('');
          }}
        >
          {errMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
