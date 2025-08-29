import { useState, useEffect } from 'react';
import { Filament, FilamentFormData } from '@/types/filament';

const STORAGE_KEY = 'filament-stock';

const initialData: Filament[] = [
  { id: '1', marca: 'eSUN', material: 'PLA', cor: 'Preto', quantidade: 3 },
  { id: '2', marca: 'Prusa Research', material: 'PETG', cor: 'Vermelho', quantidade: 1 },
  { id: '3', marca: 'Creality', material: 'ABS', cor: 'Branco', quantidade: 2 },
  { id: '4', marca: 'Overture', material: 'TPU', cor: 'Azul', quantidade: 0 },
  { id: '5', marca: 'Hatchbox', material: 'PLA', cor: 'Verde', quantidade: 4 },
  { id: '6', marca: 'Anycubic', material: 'Nylon', cor: 'Cinza', quantidade: 1 },
  { id: '7', marca: 'Polymaker', material: 'PLA', cor: 'Amarelo', quantidade: 2 },
  { id: '8', marca: 'Sunlu', material: 'PETG', cor: 'Laranja', quantidade: 0 },
  { id: '9', marca: 'Geeetech', material: 'ABS', cor: 'Azul Claro', quantidade: 1 },
  { id: '10', marca: 'Bambu Lab', material: 'PLA', cor: 'Rosa', quantidade: 5 },
];

export function useFilamentStock() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFilaments(JSON.parse(stored));
    } else {
      setFilaments(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (newFilaments: Filament[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilaments));
    setFilaments(newFilaments);
  };

  const addFilament = (formData: FilamentFormData) => {
    const newFilament: Filament = {
      id: Date.now().toString(),
      ...formData
    };
    const updated = [...filaments, newFilament];
    saveToStorage(updated);
  };

  const updateFilament = (id: string, formData: FilamentFormData) => {
    const updated = filaments.map(f => 
      f.id === id ? { ...f, ...formData } : f
    );
    saveToStorage(updated);
  };

  const deleteFilament = (id: string) => {
    const updated = filaments.filter(f => f.id !== id);
    saveToStorage(updated);
  };

  const updateQuantity = (id: string, quantidade: number) => {
    const updated = filaments.map(f => 
      f.id === id ? { ...f, quantidade: Math.max(0, quantidade) } : f
    );
    saveToStorage(updated);
  };

  const exportToCSV = () => {
    const headers = ['Marca', 'Material', 'Cor', 'Quantidade (Rolos)'];
    const csvContent = [
      headers.join(','),
      ...filaments.map(f => 
        `${f.marca},${f.material},${f.cor},${f.quantidade}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estoque-filamentos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      const imported = lines
        .filter(line => line.trim())
        .map((line, index) => {
          const [marca, material, cor, quantidade] = line.split(',');
          return {
            id: `imported-${Date.now()}-${index}`,
            marca: marca?.trim() || '',
            material: material?.trim() || '',
            cor: cor?.trim() || '',
            quantidade: parseInt(quantidade?.trim() || '0')
          };
        })
        .filter(f => f.marca && f.material && f.cor);
      
      saveToStorage(imported);
    };
    reader.readAsText(file);
  };

  const stats = {
    total: filaments.length,
    lowStock: filaments.filter(f => f.quantidade <= 1).length,
    outOfStock: filaments.filter(f => f.quantidade === 0).length,
    totalRolls: filaments.reduce((sum, f) => sum + f.quantidade, 0)
  };

  return {
    filaments,
    loading,
    addFilament,
    updateFilament,
    deleteFilament,
    updateQuantity,
    exportToCSV,
    importFromCSV,
    stats
  };
}