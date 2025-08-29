import { Filament } from '@/types/filament';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilamentCardProps {
  filament: Filament;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onEdit: (filament: Filament) => void;
  onDelete: (id: string) => void;
}

const getMaterialColor = (material: string) => {
  const colors: Record<string, string> = {
    'PLA': 'bg-blue-100 text-blue-800 border-blue-200',
    'PETG': 'bg-green-100 text-green-800 border-green-200',
    'ABS': 'bg-purple-100 text-purple-800 border-purple-200',
    'TPU': 'bg-orange-100 text-orange-800 border-orange-200',
    'Nylon': 'bg-gray-100 text-gray-800 border-gray-200',
    'ASA': 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[material] || 'bg-muted text-muted-foreground';
};

const getStockStatus = (quantidade: number) => {
  if (quantidade === 0) return { variant: 'destructive' as const, text: 'Sem Estoque' };
  if (quantidade <= 1) return { variant: 'warning' as const, text: 'Estoque Baixo' };
  return { variant: 'success' as const, text: 'Em Estoque' };
};

export function FilamentCard({ filament, onUpdateQuantity, onEdit, onDelete }: FilamentCardProps) {
  const stockStatus = getStockStatus(filament.quantidade);
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-card-foreground">{filament.marca}</h3>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getMaterialColor(filament.material))}>
                {filament.material}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(filament)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(filament.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Cor</p>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
              style={{ backgroundColor: filament.corRgb }}
            />
            <div>
              <p className="font-medium">{filament.cor}</p>
              <p className="text-xs text-muted-foreground font-mono">{filament.corRgb}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Quantidade</p>
            <p className="text-2xl font-bold">{filament.quantidade}</p>
            <p className="text-xs text-muted-foreground">rolos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(filament.id, filament.quantidade - 1)}
              disabled={filament.quantidade <= 0}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(filament.id, filament.quantidade + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <Badge variant={stockStatus.variant} className="w-full justify-center">
          {stockStatus.text}
        </Badge>
      </CardContent>
    </Card>
  );
}