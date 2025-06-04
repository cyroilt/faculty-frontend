import React, { useState } from 'react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Мы всегда готовы ответить на ваши вопросы и помочь
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
                        <h2 className="text-2xl font-semibold text-white mb-6">Отправить сообщение</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-white mb-2">Сообщение отправлено!</h3>
                <p className="text-gray-400 mb-6">Мы свяжемся с вами в ближайшее время</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Отправить еще одно сообщение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Тема *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors duration-300"
                  >
                    <option value="">Выберите тему</option>
                    <option value="general">Общие вопросы</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="academic">Академические вопросы</option>
                    <option value="partnership">Сотрудничество</option>
                    <option value="feedback">Отзывы и предложения</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300 resize-none"
                    placeholder="Опишите ваш вопрос или предложение..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <span>📧</span>
                      <span>Отправить сообщение</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Контактная информация</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Адрес</h3>
                    <p className="text-gray-400">
                      ул. Университетская, 1<br />
                      г. Москва, 119991<br />
                      Российская Федерация
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Телефон</h3>
                    <p className="text-gray-400">
                      +7 (495) 123-45-67<br />
                      +7 (495) 123-45-68
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-gray-400">
                      info@faculty.edu<br />
                      support@faculty.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Часы работы</h3>
                    <p className="text-gray-400">
                      Пн-Пт: 9:00 - 18:00<br />
                      Сб: 10:00 - 16:00<br />
                      Вс: выходной
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Быстрые ссылки</h2>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-400 hover:text-gold-400 transition-colors duration-300"
                >
                  <span>📋</span>
                  <span>Часто задаваемые вопросы</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-400 hover:text-gold-400 transition-colors duration-300"
                >
                  <span>📖</span>
                  <span>Руководство пользователя</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-400 hover:text-gold-400 transition-colors duration-300"
                >
                  <span>🔧</span>
                  <span>Техническая поддержка</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-400 hover:text-gold-400 transition-colors duration-300"
                >
                  <span>💬</span>
                  <span>Онлайн чат</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Социальные сети</h2>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors duration-300"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400 hover:bg-sky-500/30 transition-colors duration-300"
                >
                  <span className="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-colors duration-300"
                >
                  <span className="text-xl">📷</span>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors duration-300"
                >
                  <span className="text-xl">📺</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Как нас найти</h2>
            <div className="bg-navy-700 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-400">Интерактивная карта</p>
                <p className="text-gray-500 text-sm mt-1">Здесь будет размещена карта с местоположением</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
