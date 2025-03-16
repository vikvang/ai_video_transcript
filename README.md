# AI Video Transcript Assistant

## Current Vision

A Chrome extension that transforms video watching into an interactive learning experience through AI-powered transcript analysis and real-time insights.

## Core Features

### 1. AI-Powered Analysis

- Real-time Q&A about video content using Perplexity API
- Fact-checking overlay for outdated/incorrect information
- "Smart Context" feature showing relevant updates
- Semantic search within transcript using local embeddings
- Highlighted relevant sections in transcript

### 2. Learning Tools

- Markdown note-taking synchronized with timestamps
- AI-suggested tags for notes
- Transcript caching for offline access

### 3. Video Support

- YouTube integration
- Vimeo support
- Generic HTML5 video players
- Universal transcript extraction

### 4. User Features

- Social authentication (Google, GitHub)
- Personal API key management
- User preferences storage
- Watch history with AI insights

## Technical Stack

- Backend: GCP
- Authentication: Social Auth
- AI: Perplexity API + Local Embeddings
- Storage: User preferences, search history, watched videos

## Rate Limiting

- API calls limited per user/time window
- Cached transcripts to reduce API load
- Local processing when possible

## Privacy Requirements

1. User Data Storage

   - Encrypted storage of API keys
   - Minimal personal information collection
   - Clear data retention policies
   - Option for data export/deletion

2. Video Data
   - Local caching with user consent
   - Secure transmission of transcripts
   - No permanent storage of video content

## Future Features (Backlog)

### Phase 1: Enhanced Learning

- Spaced repetition for key points
- AI-generated practice questions
- Learning path suggestions
- Quiz generation

### Phase 2: Collaboration

- Collaborative note sharing
- Team features for educational institutions
- Integration with learning management systems

### Phase 3: Advanced Features

- Custom LLM fine-tuning
- Advanced learning analytics
- Mobile application
- Web dashboard for history/notes

### Phase 4: Premium Features

- Team/Enterprise plans
- API access
- Advanced analytics
- Custom integrations

## Fact-Checking Options

1. Perplexity API (primary)
2. Google Fact Check API
3. NewsGuard API
4. ClaimReview markup
5. Custom fact-checking using multiple sources

## Notes

- Initial user base: 20-30 users
- Users provide their own API keys initially
- Focus on student and content creator needs
- Privacy-first approach with local processing when possible

## Development Priorities

1. Core extension functionality
2. Transcript extraction
3. AI integration
4. Note-taking features
5. User authentication
6. Data storage
7. Rate limiting
8. Caching system

## Technical Debt Considerations

- Scalable architecture for future growth
- Modular design for feature additions
- Testing infrastructure
- Documentation
- Security best practices
- Performance monitoring
