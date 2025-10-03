
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { educationalContent, getEducationalContentByCategory } from '@/data/vaccines';
import { EducationalContent } from '@/types/vaccine';

const categories = ['Todos', 'Prevención', 'Prevención del Cáncer', 'Pediatría', 'Salud Pública'];

export default function EducationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [bookmarkedContent, setBookmarkedContent] = useState<string[]>([]);

  const filteredContent = selectedCategory === 'Todos' 
    ? educationalContent 
    : getEducationalContentByCategory(selectedCategory);

  const toggleBookmark = (contentId: string) => {
    setBookmarkedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleContentPress = (content: EducationalContent) => {
    Alert.alert(
      content.title,
      content.content,
      [
        { text: 'Cerrar', style: 'cancel' },
        { 
          text: 'Marcar como Leído', 
          onPress: () => console.log('Marked as read:', content.id) 
        },
      ]
    );
  };

  const getContentIcon = (type: EducationalContent['type']) => {
    switch (type) {
      case 'article':
        return 'doc.text';
      case 'video':
        return 'play.circle';
      case 'infographic':
        return 'photo';
      default:
        return 'doc';
    }
  };

  const getContentColor = (type: EducationalContent['type']) => {
    switch (type) {
      case 'article':
        return colors.primary;
      case 'video':
        return colors.error;
      case 'infographic':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderContentCard = (content: EducationalContent) => {
    const isBookmarked = bookmarkedContent.includes(content.id);
    
    return (
      <TouchableOpacity
        key={content.id}
        style={[commonStyles.card, styles.contentCard]}
        onPress={() => handleContentPress(content)}
      >
        {/* Content Image */}
        {content.imageUrl && (
          <Image source={{ uri: content.imageUrl }} style={styles.contentImage} />
        )}
        
        {/* Content Header */}
        <View style={styles.contentHeader}>
          <View style={styles.contentMeta}>
            <View style={[styles.typeIcon, { backgroundColor: getContentColor(content.type) }]}>
              <IconSymbol 
                name={getContentIcon(content.type)} 
                size={16} 
                color={colors.card} 
              />
            </View>
            <Text style={[commonStyles.textSmall, { color: getContentColor(content.type) }]}>
              {content.type.toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => toggleBookmark(content.id)}>
            <IconSymbol 
              name={isBookmarked ? 'bookmark.fill' : 'bookmark'} 
              size={20} 
              color={isBookmarked ? colors.warning : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Content Info */}
        <View style={styles.contentInfo}>
          <Text style={commonStyles.heading}>{content.title}</Text>
          <Text style={[commonStyles.textSecondary, styles.contentPreview]} numberOfLines={2}>
            {content.content}
          </Text>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {content.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={[commonStyles.row, commonStyles.spaceBetween, styles.contentFooter]}>
            <Text style={commonStyles.textSmall}>
              {formatDate(content.publishedAt)}
            </Text>
            {content.readTime && (
              <Text style={commonStyles.textSmall}>
                {content.readTime} min lectura
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCampaign = () => (
    <View style={[commonStyles.card, styles.campaignCard]}>
      <View style={styles.campaignHeader}>
        <IconSymbol name="megaphone.fill" size={24} color={colors.warning} />
        <Text style={[commonStyles.heading, { marginLeft: 12 }]}>
          Campaña Activa
        </Text>
      </View>
      
      <Text style={commonStyles.subtitle}>Temporada de Influenza 2024</Text>
      <Text style={commonStyles.textSecondary}>
        Protégete y protege a tu familia durante la temporada de gripe. 
        Conoce más sobre la importancia de la vacunación anual.
      </Text>
      
      <TouchableOpacity style={styles.campaignButton}>
        <Text style={[commonStyles.buttonText, { color: colors.primary }]}>
          Más Información
        </Text>
        <IconSymbol name="arrow.right" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Educación</Text>
          <Text style={commonStyles.textSecondary}>
            Aprende sobre vacunas y prevención
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryTabText,
                selectedCategory === category && styles.categoryTabTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Campaign */}
          {selectedCategory === 'Todos' && renderFeaturedCampaign()}
          
          {/* Content Grid */}
          {filteredContent.length > 0 ? (
            filteredContent.map(renderContentCard)
          ) : (
            <View style={[commonStyles.center, { marginTop: 50 }]}>
              <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No hay contenido disponible
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Selecciona otra categoría para ver más contenido
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTabs: {
    maxHeight: 60,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryTabTextActive: {
    color: colors.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  campaignCard: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
    marginBottom: 20,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  contentCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  contentInfo: {
    flex: 1,
  },
  contentPreview: {
    marginTop: 8,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  contentFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
