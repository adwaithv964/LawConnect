import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { getArticles } from 'utils/api'; // Or create a fetchArticleById using api.js

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Quick and dirty way to get the article using the existing API method.
        // Ideally the backend should have a /api/articles/:id route.
        const fetchArticle = async () => {
            try {
                const data = await getArticles({ limit: 100 });
                const found = data?.articles?.find(a => String(a._id) === String(id) || String(a.id) === String(id));
                if (found) {
                    setArticle(found);
                }
            } catch (err) {
                console.error("Failed to fetch article:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pt-24 pb-12 flex justify-center items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Loader" className="animate-spin" size={24} color="currentColor" />
                        <span>Loading article...</span>
                    </div>
                </main>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 pt-24 pb-12 flex flex-col justify-center items-center text-center px-4">
                    <Icon name="FileQuestion" size={64} className="text-muted-foreground mb-4 opacity-50" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
                    <p className="text-muted-foreground mb-6">The article you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate('/legal-library')} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth">
                        Back to Library
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-1 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-muted-foreground mb-6">
                        <Link to="/main-dashboard" className="hover:text-foreground transition-smooth">Dashboard</Link>
                        <Icon name="ChevronRight" size={14} className="mx-2" color="currentColor" />
                        <Link to="/legal-library" className="hover:text-foreground transition-smooth">Legal Library</Link>
                        <Icon name="ChevronRight" size={14} className="mx-2" color="currentColor" />
                        <span className="text-foreground font-medium truncate">{article.title}</span>
                    </div>

                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                                <Icon name={article.categoryIcon || 'FileText'} size={14} color="currentColor" />
                                {article.category}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                ${article.difficulty === 'beginner' ? 'bg-success/10 text-success' :
                                    article.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                                        'bg-error/10 text-error'}`}
                            >
                                {article.difficulty}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
                            <span className="flex items-center gap-1.5">
                                <Icon name="Calendar" size={16} color="currentColor" />
                                {article.publishDate || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Icon name="Clock" size={16} color="currentColor" />
                                {article.readTime || '5'} min read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Icon name="Eye" size={16} color="currentColor" />
                                {article.views || 0} views
                            </span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {article.image && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-elevation-2 border border-border">
                            <Image
                                src={article.image}
                                alt={article.imageAlt || article.title}
                                className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <article className="prose prose-slate prose-img:rounded-xl max-w-none text-foreground leading-relaxed
            prose-headings:font-heading prose-headings:font-semibold prose-headings:text-foreground
            prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-smooth
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1 prose-code:rounded
            prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
                    >
                        {article.content ? (
                            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '<br/><br/>') }} />
                        ) : (
                            <p>{article.excerpt}</p>
                        )}
                    </article>

                    {/* Key Takeaways Section (if available) */}
                    {article.keyTakeaways && (
                        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                            <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                                <Icon name="Lightbulb" size={24} className="text-primary" />
                                Key Takeaways
                            </h3>
                            <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm lg:text-base">
                                {article.keyTakeaways}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
