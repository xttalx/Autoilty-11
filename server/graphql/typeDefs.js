const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Business {
    id: ID!
    name: String!
    slug: String!
    category: String!
    description: String
    location: Location!
    contact: Contact
    score: Score!
    aggregateRating: Rating!
    verified: Boolean!
    isPremium: Boolean!
    analytics: Analytics
    communityData: CommunityData
    images: [Image]
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    address: Address!
    coordinates: Coordinates
  }

  type Address {
    street: String
    city: String!
    province: String!
    postalCode: String
    country: String
  }

  type Coordinates {
    type: String
    coordinates: [Float]
  }

  type Contact {
    phone: String
    email: String
    website: String
    bookingUrl: String
  }

  type Score {
    reviews: Float
    community: Float
    socialSignals: Float
    canadianFactors: Float
    total: Float!
  }

  type Rating {
    average: Float!
    count: Int!
  }

  type Analytics {
    profileViews: Int
    clickThroughs: Int
    phoneClicks: Int
    websiteClicks: Int
  }

  type CommunityData {
    forumThreads: [ForumThread]
    userVotes: UserVotes
    recommendations: Int
  }

  type ForumThread {
    threadId: String
    title: String
    url: String
    sentiment: String
    votes: Int
  }

  type UserVotes {
    upvotes: Int
    downvotes: Int
  }

  type Image {
    url: String
    caption: String
    isPrimary: Boolean
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    profile: UserProfile
    votes: [Vote]
    bookmarks: [Business]
  }

  type UserProfile {
    firstName: String
    lastName: String
    avatar: String
    bio: String
    location: UserLocation
  }

  type UserLocation {
    city: String
    province: String
  }

  type Vote {
    businessId: ID!
    voteType: String!
    votedAt: String!
  }

  type BusinessList {
    businesses: [Business]!
    total: Int!
    page: Int!
    pages: Int!
  }

  type Query {
    # Business queries
    businesses(
      category: String
      province: String
      city: String
      minScore: Float
      page: Int
      limit: Int
    ): BusinessList!

    business(slug: String!): Business

    topBusinesses(
      category: String!
      province: String
      limit: Int
    ): [Business]!

    nearbyBusinesses(
      lat: Float!
      lng: Float!
      maxDistance: Int
      category: String
    ): [Business]!

    searchBusinesses(
      query: String!
      category: String
      province: String
      page: Int
      limit: Int
    ): BusinessList!

    # User queries
    me: User
    userBookmarks: [Business]

    # Forum integration queries
    forumDiscussions(businessId: ID!): [ForumThread]
    
    # Stats
    platformStats: Stats
  }

  type Stats {
    totalBusinesses: Int
    averageScore: Float
    totalReviews: Int
    verifiedBusinesses: Int
  }

  type Mutation {
    # Auth mutations
    register(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    # Business mutations
    createBusiness(input: BusinessInput!): Business!
    updateBusiness(id: ID!, input: BusinessInput!): Business!

    # Voting
    voteBusiness(
      businessId: ID!
      voteType: String!
    ): VoteResult!

    removeVote(businessId: ID!): VoteResult!

    # Bookmarks
    addBookmark(businessId: ID!): User!
    removeBookmark(businessId: ID!): User!

    # Forum sync
    syncForumThread(
      businessId: ID!
      threadId: String!
      title: String!
      url: String!
      sentiment: String
    ): Business!

    # Analytics
    trackClick(
      businessId: ID!
      clickType: String!
    ): Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type VoteResult {
    upvotes: Int!
    downvotes: Int!
    score: Score!
  }

  input BusinessInput {
    name: String!
    category: String!
    description: String
    location: LocationInput!
    contact: ContactInput
    priceRange: String
  }

  input LocationInput {
    address: AddressInput!
    coordinates: CoordinatesInput
  }

  input AddressInput {
    street: String
    city: String!
    province: String!
    postalCode: String
  }

  input CoordinatesInput {
    coordinates: [Float]!
  }

  input ContactInput {
    phone: String
    email: String
    website: String
  }
`;

module.exports = typeDefs;


