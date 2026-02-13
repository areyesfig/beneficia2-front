import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import {
  Home,
  Gift,
  CircleDollarSign,
  ChevronRight,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  type LucideIcon,
} from 'lucide-react-native';
import { formatCurrency } from '@/utils/format-currency';
import { openSafeUrl } from '@/utils/safe-open-url';
import { cardStyle, buttonStyle } from '@/styles/screenStyles';
import { theme } from '@/theme/theme';
import { VStack, HStack } from '@/theme/layout';
import { AnimatedPressableScale } from '@/components/AnimatedPressable';

export type BenefitStatus = 'ELIGIBLE' | 'MISSING_DATA';

export type ApplicationActionStatus = 'APPLIED' | 'DISMISSED';

export interface BenefitCardProps {
  id?: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  deadline: string;
  status: BenefitStatus;
  category?: string;
  urlApply?: string | null;
  /** Labels para "Te falta: X, Y" (1-2 líneas) */
  missingLabels?: string[];
  onPostular?: () => void;
  onAction?: (benefitId: string, status: ApplicationActionStatus) => void;
  onCompletarPerfil?: () => void;
}

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  VIVIENDA: { Icon: Home, bg: theme.colors.primaryTint, color: theme.colors.primary },
  BONOS_ESTATALES: { Icon: Gift, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  SALUD_Y_CUIDADOS: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  SALUD: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  NINEZ_Y_ADOLESCENCIA: { Icon: Baby, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  JUVENTUD_Y_ESTUDIOS: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  EDUCACION: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  ADULTO_MAYOR: { Icon: User, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  EMPRENDIMIENTO: { Icon: Rocket, bg: theme.colors.primaryTint, color: theme.colors.primary },
  default: { Icon: CircleDollarSign, bg: theme.colors.border, color: theme.colors.textSecondary },
};

function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_ICON.default;
  const key = category.toUpperCase().replace(/\s+/g, '_');
  return CATEGORY_ICON[key] ?? CATEGORY_ICON.default;
}

const MAX_DESCRIPTION_PARAM_LENGTH = 800;

export function BenefitCard({
  id,
  title,
  description,
  amount,
  deadline,
  status,
  category,
  urlApply,
  missingLabels,
  onPostular,
  onAction,
  onCompletarPerfil,
}: BenefitCardProps) {
  const isEligible = status === 'ELIGIBLE';
  const hasMissing = (missingLabels?.length ?? 0) > 0;
  const { Icon, bg, color } = getCategoryStyle(category);
  const showActionBar = onAction && id;
  const teFaltaLine = hasMissing
    ? `Te falta: ${missingLabels!.slice(0, 3).join(', ')}`
    : null;

  const handleApply = async () => {
    if (urlApply) await openSafeUrl(urlApply);
    if (id) onAction?.(id, 'APPLIED');
  };

  const cardContent = (
    <>
      <HStack spacing={theme.spacing.sm} style={{ justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
        <View
          style={[
            { width: 40, height: 40, borderRadius: theme.borderRadius.full, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
            cardStyle.wrapper,
          ]}
        >
          <Icon size={22} color={color} strokeWidth={2} />
        </View>
        <View
          style={[
            {
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.full,
              backgroundColor: isEligible ? theme.colors.successTint : theme.colors.warningTint,
            },
            cardStyle.wrapper,
          ]}
        >
          <Text
            style={[
              theme.typography.caption,
              { fontWeight: '600', color: isEligible ? theme.colors.successText : theme.colors.warningText },
            ]}
          >
            {isEligible ? '✅ Elegible' : '⚠️ Falta info'}
          </Text>
        </View>
      </HStack>

      <Text style={[theme.typography.h3, { color: theme.colors.text }]} numberOfLines={2}>
        {title}
      </Text>
      {teFaltaLine ? (
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]} numberOfLines={2}>
          {teFaltaLine}
        </Text>
      ) : null}
      <Text style={[theme.typography.h2, { color: theme.colors.primaryDark, marginTop: theme.spacing.sm }]}>
        {formatCurrency(amount)}
      </Text>
      <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
        Vence: {deadline}
      </Text>

      {!isEligible && (
        <VStack spacing={theme.spacing.xs} style={{ marginTop: theme.spacing.md }}>
          <View
            style={[
              { height: 6, width: '100%', overflow: 'hidden', borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.border },
              cardStyle.wrapper,
            ]}
          >
            <View
              style={[{ height: '100%', borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.warning }, { width: '50%' }]}
            />
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>1 de 2 requisitos</Text>
        </VStack>
      )}

      {showActionBar ? (
        <HStack spacing={12} style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
          <Pressable
            onPress={() => onAction(id!, 'DISMISSED')}
            style={[
              { flex: 1, paddingVertical: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
              buttonStyle.rounded,
            ]}
          >
            <Text style={[theme.typography.label, { textAlign: 'center', color: theme.colors.textSecondary }]}>Ocultar</Text>
          </Pressable>
          {hasMissing && onCompletarPerfil ? (
            <Pressable
              onPress={onCompletarPerfil}
              style={[
                { flex: 1, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.primary },
                buttonStyle.rounded,
                buttonStyle.shadowPrimary,
              ]}
            >
              <Text style={[theme.typography.label, { textAlign: 'center', fontWeight: '700', color: '#fff' }]}>Completar perfil</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleApply}
              style={[
                { flex: 1, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.primary },
                buttonStyle.rounded,
                buttonStyle.shadowPrimary,
              ]}
            >
              <Text style={[theme.typography.label, { textAlign: 'center', fontWeight: '700', color: '#fff' }]}>Postular 🚀</Text>
            </Pressable>
          )}
        </HStack>
      ) : (
        <View style={{ marginTop: theme.spacing.md, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ChevronRight size={20} color={theme.colors.textSecondary} strokeWidth={2} />
        </View>
      )}
    </>
  );

  const cardWrapperStyle = [
    { overflow: 'hidden', backgroundColor: theme.colors.surface, padding: theme.spacing.lg },
    cardStyle.wrapper,
    cardStyle.shadow,
  ];

  if (id) {
    const descParam = description?.trim();
    const query = new URLSearchParams({
      title: title ?? '',
      status,
      deadline: deadline ?? '',
      amount: amount != null ? String(amount) : '',
      ...(descParam != null && descParam !== '' ? { description: descParam.length > MAX_DESCRIPTION_PARAM_LENGTH ? descParam.slice(0, MAX_DESCRIPTION_PARAM_LENGTH) + '…' : descParam } : {}),
    });
    const href = `/benefit/${id}?${query.toString()}`;
    return (
      <Link href={href} asChild>
        <AnimatedPressableScale style={cardWrapperStyle}>
          {cardContent}
        </AnimatedPressableScale>
      </Link>
    );
  }

  return (
    <AnimatedPressableScale style={cardWrapperStyle} onPress={onPostular}>
      {cardContent}
    </AnimatedPressableScale>
  );
}
