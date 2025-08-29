import { useState, useMemo } from 'react';
import { useFilamentStock } from '@/hooks/useFilamentStock';
import { FilamentCard } from '@/components/FilamentCard';
import { FilamentForm } from '@/components/FilamentForm';
import { Filament } from '@/types/filament';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Upload, Search, Package, AlertTriangle, XCircle, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const { 
    filaments, 
    loading, 
    addFilament, 
    updateFilament, 
    deleteFilament, 
    updateQuantity,
    exportToCSV,
    importFromCSV,
    stats 
  } = useFilamentStock();
  
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');

  const filteredFilaments = useMemo(() => {
    return filaments.filter(filament => {
      const matchesSearch = !searchTerm || 
        filament.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filament.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filament.cor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMaterial = filterMaterial === 'all' || filament.material === filterMaterial;
      const matchesBrand = filterBrand === 'all' || filament.marca === filterBrand;
      
      return matchesSearch && matchesMaterial && matchesBrand;
    });
  }, [filaments, searchTerm, filterMaterial, filterBrand]);

  const uniqueMaterials = [...new Set(filaments.map(f => f.material))];
  const uniqueBrands = [...new Set(filaments.map(f => f.marca))];

  const handleEdit = (filament: Filament) => {
    setEditingFilament(filament);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteFilament(id);
    toast({
      title: "Filamento removido",
      description: "O filamento foi removido do estoque.",
    });
  };

  const handleFormSubmit = (data: any) => {
    if (editingFilament) {
      updateFilament(editingFilament.id, data);
    } else {
      addFilament(data);
    }
    setEditingFilament(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingFilament(null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromCSV(file);
      toast({
        title: "Dados importados",
        description: "Os dados do CSV foram importados com sucesso.",
      });
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg">Carregando estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Sistema de Estoque de Filamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu inventário de filamentos para impressão 3D
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tipos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Rolos</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRolls}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowStock}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por marca, material ou cor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterMaterial} onValueChange={setFilterMaterial}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os materiais</SelectItem>
                {uniqueMaterials.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                {uniqueBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
            
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            
            <Button variant="outline" className="gap-2" asChild>
              <label>
                <Upload className="h-4 w-4" />
                Importar
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>

        {/* Filaments Grid */}
        {filteredFilaments.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum filamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterMaterial !== 'all' || filterBrand !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Adicione seu primeiro filamento para começar.'}
            </p>
            {!searchTerm && filterMaterial === 'all' && filterBrand === 'all' && (
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Filamento
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFilaments.map((filament) => (
              <FilamentCard
                key={filament.id}
                filament={filament}
                onUpdateQuantity={updateQuantity}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        <FilamentForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          filament={editingFilament}
        />
      </div>
    </div>
  );
};

export default Index;