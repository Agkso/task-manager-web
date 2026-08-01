import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCard } from '../components/project-card'
import type { RespostaProjeto } from '@/features/projetos/types'

function projetoDeTeste(sobrescritas: Partial<RespostaProjeto> = {}): RespostaProjeto {
  return {
    id: 1,
    nome: 'Projeto Alpha',
    descricao: 'Descricao do projeto',
    donoId: 1,
    donoNome: 'Maria Silva',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
    ...sobrescritas,
  }
}

describe('ProjectCard', () => {
  it('mostra nome, descricao e dono do projeto', () => {
    render(<ProjectCard projeto={projetoDeTeste()} />)

    expect(screen.getByText('Projeto Alpha')).toBeInTheDocument()
    expect(screen.getByText('Descricao do projeto')).toBeInTheDocument()
    expect(screen.getByText('Dono: Maria Silva')).toBeInTheDocument()
  })

  it('mostra texto padrao quando o projeto nao tem descricao', () => {
    render(<ProjectCard projeto={projetoDeTeste({ descricao: null })} />)

    expect(screen.getByText('Sem descricao')).toBeInTheDocument()
  })

  it('gera iniciais a partir das duas primeiras palavras do nome do projeto', () => {
    render(<ProjectCard projeto={projetoDeTeste({ nome: 'Joao Pedro Souza' })} />)

    expect(screen.getByText('JP')).toBeInTheDocument()
  })
})
