import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"

function App() {
  const [keyword, setKeyword] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value)
  }

  const handleSearch = async () => {
    if (!keyword) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await axios.post(
        "https://nbx5srvl1g.execute-api.us-east-1.amazonaws.com/twitter-sentiment-analysis",
        {
          keyword,
        }
      )
      setResult(response.data.results)
    } catch (err) {
      setError("Error fetching data")
    } finally {
      setLoading(false)
    }
  }

  const getColor = (sentiment) => {
    return sentiment === "POSITIVE"
      ? "green"
      : sentiment === "NEGATIVE"
      ? "red"
      : ""
  }
  return (
    <div style={{ padding: "20px" }}>
      <h2>News API Sentiment Analysis</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault() // stop the form from refreshing the page
          handleSearch()
        }}
      >
        <TextField
          label="Enter Keyword"
          variant="outlined"
          value={keyword}
          onChange={handleKeywordChange}
          style={{ marginBottom: "20px" }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </Button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <h3>Sentiment</h3>
                </TableCell>
                <TableCell>
                  <h3>Headline</h3>
                </TableCell>
                <TableCell>
                  <h3>Author</h3>
                </TableCell>
                <TableCell>
                  <h3>Source</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.map((r) => (
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                        color: getColor(r.sentiment),
                      }}
                    >
                      {r.sentiment}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={r.url} target="_blank">
                      {r.headline}
                    </Link>
                  </TableCell>
                  <TableCell>{r.author}</TableCell>
                  <TableCell>{r.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default App
