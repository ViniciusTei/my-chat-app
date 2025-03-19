import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, Mock } from 'vitest'

import MessageForm from './message-form'
import { useSessions } from './sessions-provider'

// Mock the useSessions hook
vi.mock('./sessions-provider', () => ({
  useSessions: vi.fn(),
}))

describe('MessageForm', () => {
  it('should render the form and send a message', async () => {
    const mockUpdateSessionMessages = vi.fn()
    const mockAddSession = vi.fn()

      // Mock implementation of useSessions
      (useSessions as Mock).mockImplementation(() => ({
        activeSession: { id: 1 },
        loading: false,
        updateSessionMessages: mockUpdateSessionMessages,
        addSession: mockAddSession,
      }))

    render(<MessageForm />)

    // Verify that the form elements are rendered
    const textarea = screen.getByPlaceholderText('Ask a question or share some code...')
    const button = screen.getByRole('button')

    expect(textarea).not.toBeNull()
    expect(button).not.toBeNull()

    // Simulate user input and form submission
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockUpdateSessionMessages).toHaveBeenCalledWith(1, 'Test message')
    })
  })

  it('should add a new session if there is no active session', async () => {
    const mockAddSession = vi.fn()

      // Mock implementation of useSessions
      (useSessions as Mock).mockImplementation(() => ({
        activeSession: null,
        loading: false,
        updateSessionMessages: vi.fn(),
        addSession: mockAddSession,
      }))

    render(<MessageForm />)

    // Verify that the form elements are rendered
    const textarea = screen.getByPlaceholderText('Ask a question or share some code...')
    const button = screen.getByRole('button')

    expect(textarea).not.toBeNull()
    expect(button).not.toBeNull()

    // Simulate user input and form submission
    fireEvent.change(textarea, { target: { value: 'New session message' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockAddSession).toHaveBeenCalledWith({
        role: 'user',
        content: 'New session message',
        timestamp: expect.any(Number),
      })
    })
  })

  it('should show the loading spinner when loading', () => {
    // Mock implementation of useSessions
    (useSessions as Mock).mockImplementation(() => ({
      activeSession: null,
      loading: true,
      updateSessionMessages: vi.fn(),
      addSession: vi.fn(),
    }))

    render(<MessageForm />)

    // Verify that the loading spinner is displayed
    expect(screen.getByText('Pensando')).not.toBeNull()
  })
})
