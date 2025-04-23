'use client'

import { useState } from 'react'

export default function Visualizer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generateFrame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shoot Brief Visualizer
          </h1>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Enter your shoot brief
            </label>
            <div className="mt-1">
              <textarea
                id="search"
                name="search"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Describe your shoot brief..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Frame'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Frame</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 