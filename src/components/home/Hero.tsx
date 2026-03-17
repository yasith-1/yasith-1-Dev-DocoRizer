import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroProps {
    isAuthenticated: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isAuthenticated }) => {
    return (
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <div className="mb-10 animate-fade-in flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 dark:opacity-40 animate-pulse"></div>
                            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <FileText className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight animate-fade-in">
                        Master Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Development Docs</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                        The ultimate workspace for developers to organize, package, and share project documentation. Stop searching, start building.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-delayed">
                        {isAuthenticated ? (
                            <>
                                <Link to="/create-project">
                                    <Button size="xl" className="group">
                                        <span>New Project</span>
                                        <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/projects">
                                    <Button variant="secondary" size="xl">
                                        My Dashboard
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/auth">
                                    <Button size="xl" className="group">
                                        <span>Get Started - It's Free</span>
                                        <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/auth">
                                    <Button variant="outline" size="xl">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full opacity-5 dark:opacity-10 blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full opacity-5 dark:opacity-10 blur-3xl animate-float-delayed"></div>
        </section>
    );
};
